// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// Contexts
import { useProductosEstadisticas } from '@/contexts/ProductosContext'

const UserListCards = () => {
  // Obtener estadísticas de productos desde localStorage
  const estadisticas = useProductosEstadisticas()

  // Crear datos dinámicos basados en las estadísticas de productos
  const data: UserDataType[] = [
    {
      title: 'Total Productos',
      stats: estadisticas.totalProductos.toString(),
      avatarIcon: 'tabler-package',
      avatarColor: 'primary',
      trend: 'positive',
      trendNumber: '100%',
      subtitle: 'Productos en inventario'
    },
    {
      title: 'Productos Activos',
      stats: estadisticas.productosActivos.toString(),
      avatarIcon: 'tabler-check',
      avatarColor: 'success',
      trend: 'positive',
      trendNumber: `${estadisticas.totalProductos > 0 ? Math.round((estadisticas.productosActivos / estadisticas.totalProductos) * 100) : 0}%`,
      subtitle: 'Productos disponibles'
    },
    {
      title: 'Bajo Stock',
      stats: estadisticas.productosBajoStock.toString(),
      avatarIcon: 'tabler-alert-triangle',
      avatarColor: 'warning',
      trend: 'negative',
      trendNumber: `${estadisticas.totalProductos > 0 ? Math.round((estadisticas.productosBajoStock / estadisticas.totalProductos) * 100) : 0}%`,
      subtitle: 'Productos con stock bajo'
    },
    {
      title: 'Valor Inventario',
      stats: `S/.${estadisticas.valorTotalInventario.toFixed(2)}`,
      avatarIcon: 'tabler-check',
      avatarColor: 'info',
      trend: 'positive',
      trendNumber: '100%',
      subtitle: 'Valor total del inventario'
    }
  ]

  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} item xs={12} sm={6} md={3}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default UserListCards
