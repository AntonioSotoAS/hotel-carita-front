// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Component Imports
import StockHistoryTable from './StockHistoryTable'

// Type Imports
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

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

// Datos de estadísticas para el historial de stock
const stockStatsData: UserDataType[] = [
  {
    title: 'Entradas Hoy',
    stats: '8',
    avatarIcon: 'tabler-arrow-down',
    avatarColor: 'success',
    trend: 'positive',
    trendNumber: '12%',
    subtitle: 'Productos ingresados'
  },
  {
    title: 'Salidas Hoy',
    stats: '5',
    avatarIcon: 'tabler-arrow-up',
    avatarColor: 'error',
    trend: 'positive',
    trendNumber: '8%',
    subtitle: 'Productos vendidos'
  },
  {
    title: 'Valor Total Movimientos',
    stats: 'S/.4,267',
    avatarIcon: 'tabler-arrow-up',
    avatarColor: 'info',
    trend: 'positive',
    trendNumber: '15%',
    subtitle: 'Valor estimado hoy'
  },
  {
    title: 'Productos Activos',
    stats: '127',
    avatarIcon: 'tabler-package',
    avatarColor: 'warning',
    trend: 'negative',
    trendNumber: '2%',
    subtitle: 'Con movimientos este mes'
  }
]

const StockList = ({ stockData }: { stockData?: StockMovementType[] }) => {
  return (
    <Grid container spacing={6}>
      {/* Statistics Cards */}
      <Grid item xs={12}>
        <Grid container spacing={6}>
          {stockStatsData.map((item, i) => (
            <Grid key={i} item xs={12} sm={6} md={3}>
              <HorizontalWithSubtitle {...item} />
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Summary Cards */}
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box className='flex items-center justify-between'>
                  <Box>
                    <Typography variant='h6' color='text.primary'>
                      Movimientos del Mes
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Enero 2024
                    </Typography>
                  </Box>
                  <Box className='flex items-center gap-2'>
                    <i className='tabler-trending-up text-2xl text-success' />
                    <Typography variant='h5' color='success.main'>
                      156
                    </Typography>
                  </Box>
                </Box>
                <Box className='mt-4'>
                  <Typography variant='body2' color='text.secondary'>
                    Entradas: 89 | Salidas: 67
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box className='flex items-center justify-between'>
                  <Box>
                    <Typography variant='h6' color='text.primary'>
                      Productos Más Movidos
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Top 3 este mes
                    </Typography>
                  </Box>
                  <Box className='flex items-center gap-2'>
                    <i className='tabler-crown text-2xl text-warning' />
                  </Box>
                </Box>
                <Box className='mt-4 space-y-2'>
                  <Typography variant='body2' color='text.primary'>
                    1. Laptop HP Pavilion (23 movimientos)
                  </Typography>
                  <Typography variant='body2' color='text.primary'>
                    2. Mouse Logitech (18 movimientos)
                  </Typography>
                  <Typography variant='body2' color='text.primary'>
                    3. Teclado Mecánico (12 movimientos)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box className='flex items-center justify-between'>
                  <Box>
                    <Typography variant='h6' color='text.primary'>
                      Último Movimiento
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Tiempo real
                    </Typography>
                  </Box>
                  <Box className='flex items-center gap-2'>
                    <i className='tabler-clock text-2xl text-info' />
                  </Box>
                </Box>
                <Box className='mt-4'>
                  <Typography variant='body2' color='text.primary'>
                    Venta: Mouse Logitech (5 unidades)
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Hace 2 minutos - Vendedor1
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Stock History Table */}
      <Grid item xs={12}>
        <StockHistoryTable tableData={stockData} />
      </Grid>
    </Grid>
  )
}

export default StockList
