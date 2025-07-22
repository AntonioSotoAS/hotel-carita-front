'use client'

// React Imports
import { useUserRole } from '@/hooks/useUserRole'

// MUI Imports
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

const UserInfo = () => {
  const { user, isAdmin, isLoading } = useUserRole()

  if (isLoading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Cargando información del usuario...
        </Typography>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No hay usuario autenticado
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
          {user.name || user.email}
        </Typography>
        <Chip
          label={isAdmin ? 'Admin' : 'Usuario'}
          size="small"
          color={isAdmin ? 'primary' : 'default'}
          variant="outlined"
        />
      </Box>
      <Typography variant="caption" color="text.secondary">
        {user.email}
      </Typography>
    </Box>
  )
}

export default UserInfo
