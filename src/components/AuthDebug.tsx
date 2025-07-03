'use client'

import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'

export const AuthDebug = () => {
  const { user, isLoading, isAuthenticated, getToken, session } = useAuth()

  if (isLoading) {
    return (
      <Card sx={{ mb: 2, bgcolor: 'warning.light' }}>
        <CardContent>
          <Typography variant="h6">🔄 Cargando sesión...</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ mb: 2, bgcolor: isAuthenticated ? 'success.light' : 'error.light' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔐 Estado de Autenticación
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2">Estado:</Typography>
            <Chip
              label={isAuthenticated ? 'Autenticado' : 'No autenticado'}
              color={isAuthenticated ? 'success' : 'error'}
              size="small"
            />
          </Box>

          {isAuthenticated && user && (
            <>
              <Typography variant="body2">
                <strong>Usuario:</strong> {user.name} ({user.email})
              </Typography>

              <Typography variant="body2">
                <strong>Rol:</strong> {user.rol}
              </Typography>

              <Typography variant="body2">
                <strong>Token:</strong> {getToken() ? `${getToken()?.substring(0, 20)}...` : 'No disponible'}
              </Typography>

              <Typography variant="body2">
                <strong>Token completo disponible:</strong> {getToken() ? '✅ Sí' : '❌ No'}
              </Typography>
            </>
          )}

          {!isAuthenticated && (
            <Typography variant="body2" color="error">
              ⚠️ No hay sesión activa. Necesitas hacer login para que el token se envíe en las peticiones.
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
