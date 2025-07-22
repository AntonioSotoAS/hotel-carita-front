'use client'

import { useUserRole } from '@/hooks/useUserRole'
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material'
import { useState } from 'react'

const RoleDebug = () => {
  const { userRole, user, isLoading, isAdmin, isUser } = useUserRole()
  const [showDebug, setShowDebug] = useState(false)

  const checkLocalStorage = () => {
    const userStr = localStorage.getItem('user')
    const token = localStorage.getItem('accessToken')

    console.log('🔍 DEBUG - localStorage user:', userStr ? JSON.parse(userStr) : 'No encontrado')
    console.log('🔍 DEBUG - localStorage accessToken:', token ? 'Presente' : 'No encontrado')

    return {
      user: userStr ? JSON.parse(userStr) : null,
      token: token ? 'Presente' : 'No encontrado'
    }
  }

  const simulateAdmin = () => {
    const adminUser = {
      id: 1,
      email: 'admin@caritafeliz.com',
      name: 'Administrador',
      role: 'admin'
    }
    localStorage.setItem('user', JSON.stringify(adminUser))
    window.location.reload()
  }

  const simulateUser = () => {
    const normalUser = {
      id: 2,
      email: 'usuario@caritafeliz.com',
      name: 'Usuario',
      role: 'user'
    }
    localStorage.setItem('user', JSON.stringify(normalUser))
    window.location.reload()
  }

  const clearStorage = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    window.location.reload()
  }

  if (!showDebug) {
    return (
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      </Box>
    )
  }

  return (
    <Card sx={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 1000,
      maxWidth: 400,
      backgroundColor: 'background.paper',
      boxShadow: 3
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Debug Sistema de Roles</Typography>
          <Button size="small" onClick={() => setShowDebug(false)}>Cerrar</Button>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Estado Actual:</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Chip
              label={isLoading ? 'Cargando...' : userRole}
              color={isAdmin ? 'primary' : 'default'}
              size="small"
            />
            <Chip
              label={isAdmin ? 'Admin' : 'User'}
              color={isAdmin ? 'success' : 'default'}
              size="small"
            />
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Usuario:</Typography>
          <Typography variant="body2" color="text.secondary">
            {user ? (
              <>
                ID: {user.id}<br/>
                Email: {user.email}<br/>
                Nombre: {user.name}<br/>
                Rol: {user.role}
              </>
            ) : (
              'No hay usuario'
            )}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>localStorage:</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
            {JSON.stringify(checkLocalStorage(), null, 2)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button size="small" variant="outlined" onClick={simulateAdmin}>
            Simular Admin
          </Button>
          <Button size="small" variant="outlined" onClick={simulateUser}>
            Simular User
          </Button>
          <Button size="small" variant="outlined" color="error" onClick={clearStorage}>
            Limpiar
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RoleDebug
