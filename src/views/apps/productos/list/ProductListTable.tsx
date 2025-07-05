'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { rankItem } from '@tanstack/match-sorter-utils'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import AddProductDrawer from './AddProductDrawer'

// Context Imports
import { useProductos } from '@/contexts/ProductosContext'

// Types
import type { Producto } from '@/types/backend.types'

type ProductoWithActions = Producto & {
  actions?: string
}

const ProductListTable = () => {
  // Context
  const {
    productos,
    actualizarProducto,
    eliminarProducto,
    obtenerEstadisticas,
    exportarDatos,
    importarDatos,
    limpiarDatos
  } = useProductos()

  // States
  const [addProductOpen, setAddProductOpen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Función de filtrado
  const filteredData = useMemo(() => {
    if (!globalFilter) return productos

    return productos.filter(producto => {
      const searchTerm = globalFilter.toLowerCase()
      return (
        producto.nombre.toLowerCase().includes(searchTerm) ||
        producto.descripcion?.toLowerCase().includes(searchTerm) ||
        producto.sku?.toLowerCase().includes(searchTerm) ||
        producto.categoria?.toLowerCase().includes(searchTerm)
      )
    })
  }, [productos, globalFilter])

  // Datos paginados
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage
    const end = start + rowsPerPage
    return filteredData.slice(start, end)
  }, [filteredData, page, rowsPerPage])

  // Estadísticas
  const estadisticas = obtenerEstadisticas()

  // Funciones de manejo
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleToggleActive = (producto: Producto) => {
    actualizarProducto(producto.id, { activo: !producto.activo })
  }

  const handleUpdateStock = (producto: Producto, newStock: number) => {
    actualizarProducto(producto.id, { stock: newStock })
  }

  const handleExport = () => {
    const data = exportarDatos()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `productos-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result as string
        if (importarDatos(data)) {
          alert('Productos importados exitosamente')
        } else {
          alert('Error al importar productos')
        }
      }
      reader.readAsText(file)
    }
  }

  const getStockStatusColor = (producto: Producto) => {
    if (producto.stock <= 0) return 'error'
    if (producto.stock <= producto.stock_minimo) return 'warning'
    return 'success'
  }

  const getStockStatusText = (producto: Producto) => {
    if (producto.stock <= 0) return 'Sin Stock'
    if (producto.stock <= producto.stock_minimo) return 'Bajo Stock'
    return 'En Stock'
  }

  return (
    <>
      <Card>
        <CardHeader
          title="Gestión de Productos"
          subheader="Administra tu inventario con persistencia en localStorage"
        />
        <CardContent>
          {/* Estadísticas resumidas */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: 1, borderRadius: 1, borderColor: 'divider' }}>
                <Typography variant="h4" color="primary">{estadisticas.totalProductos}</Typography>
                <Typography variant="body2">Total Productos</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: 1, borderRadius: 1, borderColor: 'divider' }}>
                <Typography variant="h4" color="success.main">{estadisticas.productosActivos}</Typography>
                <Typography variant="body2">Productos Activos</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: 1, borderRadius: 1, borderColor: 'divider' }}>
                <Typography variant="h4" color="warning.main">{estadisticas.productosBajoStock}</Typography>
                <Typography variant="body2">Bajo Stock</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: 1, borderRadius: 1, borderColor: 'divider' }}>
                <Typography variant="h4" color="info.main">${estadisticas.valorTotalInventario.toFixed(2)}</Typography>
                <Typography variant="body2">Valor Total</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Barra de herramientas */}
          <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="Buscar productos..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="tabler-search" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<i className="tabler-plus" />}
                  onClick={() => setAddProductOpen(true)}
                >
                  Agregar Producto
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<i className="tabler-download" />}
                  onClick={handleExport}
                >
                  Exportar
                </Button>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<i className="tabler-upload" />}
                >
                  Importar
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    hidden
                  />
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<i className="tabler-trash" />}
                  onClick={() => {
                    if (confirm('¿Estás seguro de que quieres limpiar todos los productos?')) {
                      limpiarDatos()
                    }
                  }}
                >
                  Limpiar Todo
                </Button>
              </Box>
            </Grid>
          </Grid>

          {productos.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              No hay productos en el inventario. ¡Agrega tu primer producto para comenzar!
            </Alert>
          ) : null}

          {/* Tabla de productos */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="center">Stock</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CustomAvatar skin="light" color="primary" size={40}>
                          <i className="tabler-package" />
                        </CustomAvatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontSize: '0.875rem' }}>
                            {producto.nombre}
                          </Typography>
                          {producto.descripcion && (
                            <Typography variant="body2" color="text.secondary">
                              {producto.descripcion}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {producto.sku || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={producto.categoria || 'Sin categoría'}
                        variant="tonal"
                        size="small"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" sx={{ fontSize: '0.875rem' }}>
                        ${producto.precio?.toFixed(2) || '0.00'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Chip
                          label={`${producto.stock} / ${producto.stock_minimo}`}
                          size="small"
                          color={getStockStatusColor(producto)}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {getStockStatusText(producto)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={producto.activo ? 'Activo' : 'Inactivo'}
                        variant="tonal"
                        size="small"
                        color={producto.activo ? 'success' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleActive(producto)}
                          color={producto.activo ? 'error' : 'success'}
                        >
                          <i className={producto.activo ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            const newStock = prompt(`Stock actual: ${producto.stock}. Ingresa el nuevo stock:`)
                            if (newStock !== null && !isNaN(Number(newStock))) {
                              handleUpdateStock(producto, Number(newStock))
                            }
                          }}
                          color="primary"
                        >
                          <i className="tabler-edit" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </CardContent>
      </Card>

      {/* Drawer para agregar producto */}
      <AddProductDrawer
        open={addProductOpen}
        handleClose={() => setAddProductOpen(false)}
      />
    </>
  )
}

export default ProductListTable
