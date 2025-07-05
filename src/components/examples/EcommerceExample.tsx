'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, Button, TextField, Grid, Typography, Box, Chip, Alert } from '@mui/material'
import { useProducts, useOrders, useCustomers, useEcommerce } from '@/contexts/EcommerceContext'
import { useEcommerceStats, useEcommerceSearch } from '@/hooks/useEcommerceData'
import type { ProductType, OrderType, Customer } from '@/types/apps/ecommerceTypes'

const EcommerceExample = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState<'products' | 'orders' | 'customers' | 'stats'>('products')

  // Hooks del contexto
  const { products, addProduct, updateProduct, deleteProduct, updateProductStock } = useProducts()
  const { orders, addOrder, updateOrderStatus } = useOrders()
  const { customers, addCustomer } = useCustomers()
  const { exportData, importData, resetToInitialData } = useEcommerce()

  // Hooks de utilidad
  const stats = useEcommerceStats()
  const { searchProducts, searchOrders, searchCustomers } = useEcommerceSearch()

  // Estados para formularios
  const [newProduct, setNewProduct] = useState<Omit<ProductType, 'id'>>({
    productName: '',
    category: '',
    stock: true,
    sku: Math.floor(Math.random() * 100000),
    price: '',
    qty: 0,
    status: 'Published',
    image: '',
    productBrand: ''
  })

  // Funciones para manejo de datos
  const handleAddProduct = () => {
    if (newProduct.productName && newProduct.category && newProduct.price) {
      addProduct(newProduct)
      setNewProduct({
        productName: '',
        category: '',
        stock: true,
        sku: Math.floor(Math.random() * 100000),
        price: '',
        qty: 0,
        status: 'Published',
        image: '',
        productBrand: ''
      })
    }
  }

  const handleUpdateStock = (id: number, newStock: boolean) => {
    updateProductStock(id, newStock)
  }

  const handleUpdateOrderStatus = (id: number, status: string) => {
    updateOrderStatus(id, status)
  }

  const handleExport = () => {
    const data = exportData()
    if (data) {
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'ecommerce-data.json'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result as string
        if (importData(data)) {
          alert('Datos importados exitosamente')
        } else {
          alert('Error al importar datos')
        }
      }
      reader.readAsText(file)
    }
  }

  // Filtrar datos según búsqueda
  const filteredProducts = searchTerm ? searchProducts(searchTerm) : products
  const filteredOrders = searchTerm ? searchOrders(searchTerm) : orders
  const filteredCustomers = searchTerm ? searchCustomers(searchTerm) : customers

  const renderProducts = () => (
    <Grid container spacing={3}>
      {/* Formulario para agregar producto */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Agregar Nuevo Producto" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre del Producto"
                  value={newProduct.productName}
                  onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Categoría"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Precio"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cantidad"
                  type="number"
                  value={newProduct.qty}
                  onChange={(e) => setNewProduct({...newProduct, qty: parseInt(e.target.value) || 0})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Marca"
                  value={newProduct.productBrand}
                  onChange={(e) => setNewProduct({...newProduct, productBrand: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <Button onClick={handleAddProduct} variant="contained">
                  Agregar Producto
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Lista de productos */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`Productos (${filteredProducts.length})`} />
          <CardContent>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {filteredProducts.map((product) => (
                <Box key={product.id} sx={{ mb: 2, p: 2, border: 1, borderRadius: 1, borderColor: 'divider' }}>
                  <Typography variant="h6">{product.productName}</Typography>
                  <Typography variant="body2" color="text.secondary">{product.category}</Typography>
                  <Typography variant="body1">{product.price}</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={product.stock ? 'En Stock' : 'Sin Stock'}
                      color={product.stock ? 'success' : 'error'}
                      size="small"
                    />
                    <Chip
                      label={product.status}
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      onClick={() => handleUpdateStock(product.id, !product.stock)}
                      variant="outlined"
                    >
                      {product.stock ? 'Marcar Sin Stock' : 'Marcar En Stock'}
                    </Button>
                    <Button
                      size="small"
                      onClick={() => deleteProduct(product.id)}
                      variant="outlined"
                      color="error"
                      sx={{ ml: 1 }}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderOrders = () => (
    <Card>
      <CardHeader title={`Órdenes (${filteredOrders.length})`} />
      <CardContent>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {filteredOrders.map((order) => (
            <Box key={order.id} sx={{ mb: 2, p: 2, border: 1, borderRadius: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Orden #{order.order}</Typography>
              <Typography variant="body2">{order.customer} - {order.email}</Typography>
              <Typography variant="body1">${order.spent}</Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={order.status}
                  color={order.status === 'Delivered' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <Button
                  size="small"
                  onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                  variant="outlined"
                  disabled={order.status === 'Delivered'}
                >
                  Marcar como Entregado
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )

  const renderCustomers = () => (
    <Card>
      <CardHeader title={`Clientes (${filteredCustomers.length})`} />
      <CardContent>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {filteredCustomers.map((customer) => (
            <Box key={customer.id} sx={{ mb: 2, p: 2, border: 1, borderRadius: 1, borderColor: 'divider' }}>
              <Typography variant="h6">{customer.customer}</Typography>
              <Typography variant="body2">{customer.email}</Typography>
              <Typography variant="body1">{customer.country}</Typography>
              <Typography variant="body1">Total gastado: ${customer.totalSpent}</Typography>
              <Typography variant="body2">Órdenes: {customer.order}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )

  const renderStats = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Estadísticas Generales" />
          <CardContent>
            <Typography>Total Productos: {stats.totalProducts}</Typography>
            <Typography>Total Órdenes: {stats.totalOrders}</Typography>
            <Typography>Total Clientes: {stats.totalCustomers}</Typography>
            <Typography>Total Reseñas: {stats.totalReviews}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Estadísticas de Ventas" />
          <CardContent>
            <Typography>Ingresos Totales: ${stats.totalRevenue.toFixed(2)}</Typography>
            <Typography>Valor Promedio por Orden: ${stats.averageOrderValue.toFixed(2)}</Typography>
            <Typography>Órdenes Entregadas: {stats.deliveredOrders}</Typography>
            <Typography>Órdenes Pendientes: {stats.pendingOrders}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Ejemplo de Ecommerce con localStorage
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        ¡Todos los datos se guardan automáticamente en localStorage! Los cambios que hagas se mantendrán entre sesiones.
      </Alert>

      {/* Barra de herramientas */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Button onClick={() => setSelectedTab('products')} variant={selectedTab === 'products' ? 'contained' : 'outlined'}>
              Productos
            </Button>
            <Button onClick={() => setSelectedTab('orders')} variant={selectedTab === 'orders' ? 'contained' : 'outlined'} sx={{ ml: 1 }}>
              Órdenes
            </Button>
            <Button onClick={() => setSelectedTab('customers')} variant={selectedTab === 'customers' ? 'contained' : 'outlined'} sx={{ ml: 1 }}>
              Clientes
            </Button>
            <Button onClick={() => setSelectedTab('stats')} variant={selectedTab === 'stats' ? 'contained' : 'outlined'} sx={{ ml: 1 }}>
              Estadísticas
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Botones de exportar/importar */}
      <Box sx={{ mb: 3 }}>
        <Button onClick={handleExport} variant="outlined">
          Exportar Datos
        </Button>
        <Button
          component="label"
          variant="outlined"
          sx={{ ml: 1 }}
        >
          Importar Datos
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            hidden
          />
        </Button>
        <Button onClick={resetToInitialData} variant="outlined" color="warning" sx={{ ml: 1 }}>
          Resetear a Datos Iniciales
        </Button>
      </Box>

      {/* Contenido según pestaña seleccionada */}
      {selectedTab === 'products' && renderProducts()}
      {selectedTab === 'orders' && renderOrders()}
      {selectedTab === 'customers' && renderCustomers()}
      {selectedTab === 'stats' && renderStats()}
    </Box>
  )
}

export default EcommerceExample
