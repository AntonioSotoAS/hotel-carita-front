'use client'

// React Imports
import { ReactNode } from 'react'

// Custom Hook
import { useUserRole } from '@/hooks/useUserRole'

// MUI Imports
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'

interface RoleBasedAccessProps {
  allowedRoles: string[]
  children: ReactNode
  fallback?: ReactNode
  showRole?: boolean
}

const RoleBasedAccess = ({
  allowedRoles,
  children,
  fallback,
  showRole = false
}: RoleBasedAccessProps) => {
  const { rol, hasAnyRole, isLoading } = useUserRole()

  if (isLoading) {
    return (
      <Alert severity="info">
        <Typography>Verificando permisos...</Typography>
      </Alert>
    )
  }

  if (!rol) {
    return (
      <Alert severity="warning">
        <Typography>No se pudo determinar el rol del usuario</Typography>
      </Alert>
    )
  }

  if (!hasAnyRole(allowedRoles)) {
    return fallback || (
      <Alert severity="error">
        <Typography>
          No tienes permisos para acceder a esta función.
          {showRole && (
            <>
              <br />
              <strong>Tu rol:</strong> {rol}
              <br />
              <strong>Roles permitidos:</strong> {allowedRoles.join(', ')}
            </>
          )}
        </Typography>
      </Alert>
    )
  }

  return <>{children}</>
}

// Componente de ejemplo para mostrar diferentes funciones según el rol
const RoleExamples = () => {
  const { rol, isAdmin, isUser, hasRole } = useUserRole()

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🛡️ Ejemplos de Control de Roles
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Tu rol actual:</strong> <Chip label={rol || 'Sin rol'} color="primary" size="small" />
          </Typography>
        </Box>

        {/* Ejemplo 1: Solo para administradores */}
        <RoleBasedAccess allowedRoles={['admin', 'administrador']} showRole>
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography>
              🔧 <strong>Panel de Administración</strong> - Solo visible para administradores
            </Typography>
          </Alert>
        </RoleBasedAccess>

        {/* Ejemplo 2: Para múltiples roles */}
        <RoleBasedAccess allowedRoles={['admin', 'user', 'gerente']} showRole>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography>
              📊 <strong>Dashboard General</strong> - Visible para admin, user, y gerente
            </Typography>
          </Alert>
        </RoleBasedAccess>

        {/* Ejemplo 3: Solo para usuarios */}
        <RoleBasedAccess allowedRoles={['user', 'usuario']} showRole>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography>
              👤 <strong>Panel de Usuario</strong> - Solo visible para usuarios
            </Typography>
          </Alert>
        </RoleBasedAccess>

        {/* Ejemplo 4: Con fallback personalizado */}
        <RoleBasedAccess
          allowedRoles={['superadmin']}
          fallback={
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography>
                🚫 <strong>Función Super Admin</strong> - Requiere permisos especiales
              </Typography>
            </Alert>
          }
        >
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography>
              ⚡ <strong>Panel Super Admin</strong> - Máximos permisos
            </Typography>
          </Alert>
        </RoleBasedAccess>

        {/* Ejemplo 5: Usando el hook directamente */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            📝 Usando el hook directamente:
          </Typography>
          <Typography variant="body2">
            - ¿Es Admin? {isAdmin ? '✅ Sí' : '❌ No'}<br />
            - ¿Es User? {isUser ? '✅ Sí' : '❌ No'}<br />
            - ¿Tiene rol "gerente"? {hasRole('gerente') ? '✅ Sí' : '❌ No'}<br />
            - ¿Tiene rol "recepcionista"? {hasRole('recepcionista') ? '✅ Sí' : '❌ No'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RoleBasedAccess
export { RoleExamples }
