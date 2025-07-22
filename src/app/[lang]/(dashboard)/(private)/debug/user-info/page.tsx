// Component Imports
import UserInfo from '@components/UserInfo'
import { RoleExamples } from '@components/RoleBasedAccess'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

const UserInfoPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          🔍 Información del Usuario y Sesión
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Esta página te permite verificar si el <strong>rol del usuario</strong> se está guardando correctamente durante la autenticación.
          </Typography>
        </Alert>
      </Grid>

      <Grid item xs={12}>
        <UserInfo />
      </Grid>

      <Grid item xs={12}>
        <RoleExamples />
      </Grid>
    </Grid>
  )
}

export default UserInfoPage
