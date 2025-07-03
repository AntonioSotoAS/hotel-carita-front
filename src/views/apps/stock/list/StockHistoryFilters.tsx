// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Types
type StockMovementType = {
  id: number
  producto_id: number
  producto_nombre: string
  tipo_movimiento: 'entrada' | 'salida'
  cantidad: number
  stock_anterior: number
  stock_actual: number
  motivo: string
  fecha: string
  hora: string
  usuario: string
  observaciones?: string
}

const StockHistoryFilters = ({ setData, tableData }: { setData: (data: StockMovementType[]) => void; tableData?: StockMovementType[] }) => {
  // States
  const [tipoMovimiento, setTipoMovimiento] = useState<string>('')
  const [motivo, setMotivo] = useState<string>('')
  const [productoFilter, setProductoFilter] = useState<string>('')
  const [fechaDesde, setFechaDesde] = useState<string>('')
  const [fechaHasta, setFechaHasta] = useState<string>('')

  // Get unique products for filter
  const uniqueProducts = [...new Set(tableData?.map(item => item.producto_nombre) || [])]

  // Get unique motivos for filter
  const uniqueMotivos = [...new Set(tableData?.map(item => item.motivo) || [])]

  useEffect(() => {
    const filteredData = tableData?.filter(movement => {
      // Filter by movement type
      if (tipoMovimiento && movement.tipo_movimiento !== tipoMovimiento) return false

      // Filter by motivo
      if (motivo && movement.motivo !== motivo) return false

      // Filter by product
      if (productoFilter && !movement.producto_nombre.toLowerCase().includes(productoFilter.toLowerCase())) return false

      // Filter by date range
      if (fechaDesde && movement.fecha < fechaDesde) return false
      if (fechaHasta && movement.fecha > fechaHasta) return false

      return true
    })

    setData(filteredData || [])
  }, [tipoMovimiento, motivo, productoFilter, fechaDesde, fechaHasta, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={3}>
          <CustomTextField
            select
            fullWidth
            id='select-tipo-movimiento'
            value={tipoMovimiento}
            onChange={e => setTipoMovimiento(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Tipo de Movimiento</MenuItem>
            <MenuItem value='entrada'>Entrada</MenuItem>
            <MenuItem value='salida'>Salida</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomTextField
            select
            fullWidth
            id='select-motivo'
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Motivo</MenuItem>
            {uniqueMotivos.map((motivoItem, index) => (
              <MenuItem key={index} value={motivoItem}>
                {motivoItem}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomTextField
            fullWidth
            id='filter-producto'
            value={productoFilter}
            onChange={e => setProductoFilter(e.target.value)}
            placeholder='Filtrar por producto'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomTextField
            fullWidth
            type='date'
            id='fecha-desde'
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
            label='Desde'
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomTextField
            fullWidth
            type='date'
            id='fecha-hasta'
            value={fechaHasta}
            onChange={e => setFechaHasta(e.target.value)}
            label='Hasta'
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomTextField
            select
            fullWidth
            id='select-producto'
            value={productoFilter}
            onChange={e => setProductoFilter(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Todos los Productos</MenuItem>
            {uniqueProducts.map((producto, index) => (
              <MenuItem key={index} value={producto}>
                {producto}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default StockHistoryFilters
