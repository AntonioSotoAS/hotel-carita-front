// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Local Types
import type { HistorialHabitacion, FiltrosHistorial, TipoMovimiento } from './types'

// Context Imports
import { useHistorial } from '@/contexts/HistorialContext'

type Props = {
  setData: (data: HistorialHabitacion[]) => void
}

const HistorialFilters = ({ setData }: Props) => {
  // Context
  const { historial: historialData } = useHistorial()

  // States
  const [filtros, setFiltros] = useState<FiltrosHistorial>({
    habitacion: '',
    tipoMovimiento: undefined,
    fechaDesde: '',
    fechaHasta: '',
    huesped: ''
  })

  // Effect to filter data
  useEffect(() => {
    let filteredData = [...historialData]

    // Filter by habitacion
    if (filtros.habitacion) {
      filteredData = filteredData.filter(item =>
        item.habitacionNombre.toLowerCase().includes(filtros.habitacion!.toLowerCase())
      )
    }

    // Filter by tipo de movimiento
    if (filtros.tipoMovimiento) {
      filteredData = filteredData.filter(item =>
        item.tipoMovimiento === filtros.tipoMovimiento
      )
    }

    // Filter by fecha desde
    if (filtros.fechaDesde) {
      filteredData = filteredData.filter(item =>
        new Date(item.fecha) >= new Date(filtros.fechaDesde!)
      )
    }

    // Filter by fecha hasta
    if (filtros.fechaHasta) {
      filteredData = filteredData.filter(item =>
        new Date(item.fecha) <= new Date(filtros.fechaHasta!)
      )
    }

    // Filter by huesped
    if (filtros.huesped) {
      filteredData = filteredData.filter(item =>
        item.huespedNombre?.toLowerCase().includes(filtros.huesped!.toLowerCase()) ||
        item.huespedDocumento?.toLowerCase().includes(filtros.huesped!.toLowerCase())
      )
    }

    setData(filteredData)
  }, [filtros, historialData, setData])

  const handleFilterChange = (field: keyof FiltrosHistorial, value: string) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }))
  }

  const tiposMovimiento: { value: TipoMovimiento; label: string }[] = [
    { value: 'check_in', label: 'Check-In' },
    { value: 'check_out', label: 'Check-Out' },
    { value: 'cambio_estado', label: 'Cambio de Estado' },
    { value: 'reserva', label: 'Reserva' },
    { value: 'cancelacion', label: 'Cancelación' }
  ]

  // Get unique habitaciones from data
  const habitacionesUnicas = Array.from(
    new Set(historialData.map(item => item.habitacionNombre))
  ).sort()

  return (
    <CardContent>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <CustomTextField
            select
            fullWidth
            value={filtros.habitacion || ''}
            onChange={e => handleFilterChange('habitacion', e.target.value)}
            label='Filtrar por Habitación'
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Todas las habitaciones</MenuItem>
            {habitacionesUnicas.map(habitacion => (
              <MenuItem key={habitacion} value={habitacion}>
                {habitacion}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CustomTextField
            select
            fullWidth
            value={filtros.tipoMovimiento || ''}
            onChange={e => handleFilterChange('tipoMovimiento', e.target.value)}
            label='Tipo de Movimiento'
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Todos los movimientos</MenuItem>
            {tiposMovimiento.map(tipo => (
              <MenuItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CustomTextField
            fullWidth
            value={filtros.huesped || ''}
            onChange={e => handleFilterChange('huesped', e.target.value)}
            label='Buscar Huésped'
            placeholder='Nombre o documento'
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CustomTextField
            fullWidth
            type='date'
            value={filtros.fechaDesde || ''}
            onChange={e => handleFilterChange('fechaDesde', e.target.value)}
            label='Fecha Desde'
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CustomTextField
            fullWidth
            type='date'
            value={filtros.fechaHasta || ''}
            onChange={e => handleFilterChange('fechaHasta', e.target.value)}
            label='Fecha Hasta'
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default HistorialFilters
