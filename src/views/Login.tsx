'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { signIn, getSession } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, pipe, nonEmpty } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import classnames from 'classnames'
import axios from 'axios'

// Type Imports
/* eslint-disable */
import type { SystemMode } from '@core/types'
import type { Locale } from '@/configs/i18n'

// Component Imports
import { useSettings } from '@core/hooks/useSettings'
import { useImageVariant } from '@core/hooks/useImageVariant'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import { getLocalizedUrl } from '@/utils/i18n'

// Config Imports
import themeConfig from '@configs/themeConfig'


// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  email: pipe(string(), minLength(1, 'This field is required'), email('Email is invalid')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(5, 'Password must be at least 5 characters long')
  )
})

const Login = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState<string>('Verificando...')

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/auth-login-illustration-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  // useEffect para verificar el status de la API al cargar el componente
  useEffect(() => {
    const verificarStatusAPI = async () => {
      console.log('🔍 USEEFFECT: Verificando status de la API al cargar...')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

      try {
        setApiStatus('Conectando...')

        const axiosResponse = await axios.get(`${apiUrl}/auth/status`, {
          timeout: 10000, // 10 segundos de timeout
          headers: {
            'Content-Type': 'application/json',
          }
        })

        console.log('✅ API Status exitoso:', axiosResponse.data)
        console.log('🔍 Status del servidor:', axiosResponse.status)

        setApiStatus(`✅ API funcionando - ${axiosResponse.data.message}`)

      } catch (axiosError: any) {
        console.warn('⚠️ Error al verificar status de la API:', axiosError.message)

        if (axiosError.response?.status === 404) {
          setApiStatus('⚠️ Endpoint no encontrado, pero API responde')
          console.log('📝 Endpoint /auth/status no encontrado, pero API está funcionando')
        } else if (axiosError.code === 'ECONNREFUSED') {
          setApiStatus('❌ API no disponible - Verifica que el backend esté corriendo')
        } else if (axiosError.code === 'TIMEOUT') {
          setApiStatus('⏱️ Timeout - API responde lento')
        } else {
          setApiStatus(`❌ Error: ${axiosError.message}`)
        }
      }
    }

    // Ejecutar la verificación
    verificarStatusAPI()
  }, []) // Array vacío = solo se ejecuta una vez al montar el componente

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setIsLoading(true)
    setErrorState(null)

    console.log('🔍 FRONTEND: Iniciando proceso de login...')
    console.log('🔍 FRONTEND: Email:', data.email)
    console.log('🔍 FRONTEND: Password:', data.password ? '***' : 'vacío')

        try {
      console.log('🔍 FRONTEND: Llamando a signIn...')
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })

      console.log('🔍 FRONTEND: Respuesta de signIn:', res)

      if (res && res.ok && res.error === null) {
        console.log('✅ FRONTEND: Login exitoso!')

        // Obtener la sesión para acceder al token
        const session = await getSession()
        console.log('🔍 FRONTEND: Sesión obtenida:', session)
        console.log('🔍 FRONTEND: Datos del usuario en sesión:', {
          id: session?.user?.id,
          email: session?.user?.email,
          name: session?.user?.name,
          rol: session?.user?.rol,
          accessToken: session?.user?.accessToken ? 'Presente' : 'Ausente'
        })

        // Guardar el token en localStorage
        if (session?.user?.accessToken) {
          localStorage.setItem('accessToken', session.user.accessToken)
          console.log('✅ FRONTEND: Token guardado en localStorage')
        }

                // Guardar información del usuario en localStorage
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            rol: session.user.rol || 'user' // Usar 'rol' que viene del backend
          }

          localStorage.setItem('user', JSON.stringify(userData))
          console.log('✅ FRONTEND: Información del usuario guardada en localStorage:', userData)
        }

        const redirectURL = searchParams.get('redirectTo') ?? '/apps/habitaciones/list'

        // Simplificar la URL para evitar problemas con i18n
        let finalURL = redirectURL

        if (locale && locale !== 'en') {
          finalURL = `/${locale}${redirectURL.startsWith('/') ? redirectURL : '/' + redirectURL}`
        }

        console.log('🔍 FRONTEND: redirectURL:', redirectURL)
        console.log('🔍 FRONTEND: finalURL:', finalURL)

        // Usar router para la redirección
        router.replace(finalURL)
      } else if (res?.error) {
        try {
          const error = JSON.parse(res.error)

          // Mostrar mensaje de error más amigable
          if (error.message && Array.isArray(error.message)) {
            setErrorState(error)
          } else {
            setErrorState({ message: ['Error inesperado. Intenta nuevamente.'] })
          }
        } catch (parseError) {
          // Si no es un JSON válido, mostrar mensaje genérico
          console.error('Error parsing response:', res.error)
          setErrorState({ message: ['Error de conexión. Verifica que el servidor esté funcionando.'] })
        }
      } else {
        // Si no hay respuesta válida
        setErrorState({ message: ['Error inesperado. Intenta nuevamente.'] })
      }
    } catch (error) {
      console.error('Error en login:', error)

      // Manejar diferentes tipos de errores
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          setErrorState({ message: ['No se puede conectar al servidor. Verifica tu conexión.'] })
        } else if (error.message.includes('JSON')) {
          setErrorState({ message: ['Error de comunicación con el servidor.'] })
        } else {
          setErrorState({ message: ['Error interno. Intenta nuevamente.'] })
        }
      } else {
        setErrorState({ message: ['Error inesperado. Intenta nuevamente.'] })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo showText={false} />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Bienvenido a ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>Por favor, inicie sesión en su cuenta y comience la aventura</Typography>

            {/* Mostrar status de la API */}
            <Typography variant='body2' className='mt-2 text-sm text-gray-600'>
              Status de la API: {apiStatus}
            </Typography>
          </div>

          {/* Mostrar errores de manera más visible */}
          {errorState && errorState.message && errorState.message.length > 0 && (
            <Alert severity='error' className='mb-4'>
              <Typography variant='body2'>
                {errorState.message[0]}
              </Typography>
            </Alert>
          )}

          <form
            noValidate
            autoComplete='off'
            action={() => { }}
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  type='email'
                  label='Email'
                  placeholder='Ingrese su email'
                  autoComplete='email'
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...((errors.email || errorState !== null) && {
                    error: true,
                    helperText: errors?.email?.message || errorState?.message[0]
                  })}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  placeholder='············'
                  id='login-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  autoComplete='current-password'
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...(errors.password && { error: true, helperText: errors.password.message })}
                />
              )}
            />
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Recordarme' />
              <Typography
                className='text-end'
                color='primary'
                component={Link}
                href={getLocalizedUrl('/forgot-password', locale as Locale)}
              >
                Olvidé mi contraseña
              </Typography>
            </div>
            <Button fullWidth variant='contained' type='submit' disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Login'}
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>¿Nuevo en nuestra plataforma?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/register', locale as Locale)} color='primary'>
                Crear una cuenta
              </Typography>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

