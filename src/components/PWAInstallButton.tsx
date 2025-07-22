'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'

// Types
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

const PWAInstallButton = () => {
  // States
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'pc'>('pc')

  // Detect device type
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    const isAndroid = /android/.test(userAgent)

    if (isIOS) {
      setDeviceType('ios')
    } else if (isAndroid) {
      setDeviceType('android')
    } else {
      setDeviceType('pc')
    }

    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    } else if ((window.navigator as any).standalone) {
      // iOS standalone mode
      setIsInstalled(true)
    }
  }, [])

  // Handle beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()

      // Save the event for later use
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallButton(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Handle PWA installation
  const handleInstallClick = async () => {
    if (deviceType === 'ios') {
      // For iOS, show modal with instructions
      setShowIOSModal(true)
      return
    }

    // For Android and PC with deferredPrompt
    if (deferredPrompt) {
      try {
        // Show the installation prompt
        await deferredPrompt.prompt()

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === 'accepted') {
          console.log('PWA installed successfully')
          setIsInstalled(true)
        } else {
          console.log('PWA installation was dismissed')
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null)
        setShowInstallButton(false)
      } catch (error) {
        console.error('Error installing PWA:', error)
      }
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      if (deviceType === 'android') {
        alert('Para instalar la app, ve al menú del navegador y selecciona "Agregar a pantalla de inicio"')
      } else {
        alert('Para instalar la app, ve al menú del navegador y selecciona "Instalar aplicación"')
      }
    }
  }

  // Don't show button if app is already installed
  if (isInstalled) {
    return null
  }

  // Show button only if prompt is available or it's iOS
  if (!showInstallButton && deviceType !== 'ios') {
    return null
  }

  return (
    <>
      <Button
        variant='contained'
        color='primary'
        startIcon={<i className='tabler-download' />}
        onClick={handleInstallClick}
        fullWidth
        sx={{ mb: 2 }}
      >
        Instalar App
      </Button>

      {/* iOS Installation Modal */}
      <Dialog
        open={showIOSModal}
        onClose={() => setShowIOSModal(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          <Box display='flex' alignItems='center' justifyContent='space-between'>
            <Typography variant='h6'>
              Instalar App en iOS
            </Typography>
            <IconButton onClick={() => setShowIOSModal(false)} size='small'>
              <i className='tabler-x' />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box display='flex' flexDirection='column' gap={3}>
            <Typography variant='body2' color='text.secondary'>
              Para instalar la aplicación en tu iPhone o iPad, sigue estos pasos:
            </Typography>

            <Box display='flex' alignItems='center' gap={2}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                1
              </Box>
              <Box>
                <Typography variant='body2' fontWeight='medium'>
                  Toca el botón de compartir
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  <i className='tabler-share' /> en la barra inferior de Safari
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Box display='flex' alignItems='center' gap={2}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                2
              </Box>
              <Box>
                <Typography variant='body2' fontWeight='medium'>
                  Selecciona "Agregar a pantalla de inicio"
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  <i className='tabler-plus' /> Busca esta opción en el menú
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Box display='flex' alignItems='center' gap={2}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                3
              </Box>
              <Box>
                <Typography variant='body2' fontWeight='medium'>
                  Confirma la instalación
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Toca "Agregar" para instalar la app
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                backgroundColor: 'success.light',
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'success.main'
              }}
            >
              <Typography variant='body2' color='success.dark'>
                <i className='tabler-check-circle' /> Una vez instalada, podrás acceder a la app desde tu pantalla de inicio como cualquier otra aplicación.
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowIOSModal(false)} color='primary' variant='contained'>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PWAInstallButton
