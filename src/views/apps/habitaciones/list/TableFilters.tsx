// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Types
type RoomType = {
  id: number
  name: string
  estado: 'ocupada' | 'vacia' | 'en-limpieza' | 'reservada'
  fechaReserva?: string
  horaReserva?: string
}

const TableFilters = ({ setData, tableData }: { setData: (data: RoomType[]) => void; tableData?: RoomType[] }) => {
  // States
  const [estadoFilter, setEstadoFilter] = useState<string>('')
  const [nameFilter, setNameFilter] = useState<string>('')

  useEffect(() => {
    const filteredData = tableData?.filter(room => {
      // Filter by estado
      if (estadoFilter && room.estado !== estadoFilter) return false

      // Filter by name
      if (nameFilter && !room.name.toLowerCase().includes(nameFilter.toLowerCase())) return false

      return true
    })

    setData(filteredData || [])
  }, [estadoFilter, nameFilter, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            select
            fullWidth
            id='select-estado'
            value={estadoFilter}
            onChange={e => setEstadoFilter(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Todos los Estados</MenuItem>
            <MenuItem value='vacia'>Vacía</MenuItem>
            <MenuItem value='ocupada'>Ocupada</MenuItem>
            <MenuItem value='en-limpieza'>En Limpieza</MenuItem>
            <MenuItem value='reservada'>Reservada</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            id='filter-name'
            value={nameFilter}
            onChange={e => setNameFilter(e.target.value)}
            placeholder='Filtrar por nombre de habitación'
          />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
