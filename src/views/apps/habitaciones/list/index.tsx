// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import RoomListTable from './RoomListTable'

// Types
type RoomType = {
  id: number
  name: string
  estado: 'ocupada' | 'vacia' | 'en-limpieza' | 'reservada'
  fechaReserva?: string
  horaReserva?: string
  fechaCheckIn?: string
  horaCheckIn?: string
  fechaCheckOut?: string
  horaCheckOut?: string
  huespedNombre?: string
  huespedDocumento?: string
}

const RoomList = ({ roomData }: { roomData?: RoomType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <RoomListTable tableData={roomData} />
      </Grid>
    </Grid>
  )
}

export default RoomList
