# Sistema de localStorage para Ecommerce

## Descripción

Este sistema permite que todos los datos de ecommerce (productos, órdenes, clientes, reseñas, referidos) se guarden automáticamente en localStorage del navegador, manteniendo la persistencia entre sesiones.

## Características

✅ **Persistencia automática**: Los datos se guardan automáticamente en localStorage
✅ **Sincronización en tiempo real**: Los cambios se reflejan inmediatamente en toda la aplicación
✅ **Gestión de estado global**: Usando React Context para compartir datos entre componentes
✅ **Funciones CRUD completas**: Crear, leer, actualizar y eliminar datos
✅ **Exportar/Importar datos**: Funcionalidad de backup y restore
✅ **Búsqueda y filtrado**: Herramientas para encontrar datos específicos
✅ **Estadísticas**: Cálculos automáticos de métricas importantes

## Estructura del Sistema

### 1. LocalStorageService (`src/utils/localStorage.ts`)
Servicio base para manejar operaciones de localStorage:

```typescript
import { LocalStorageService } from '@/utils/localStorage'

// Obtener todos los datos
const data = LocalStorageService.getEcommerceData()

// Guardar datos
LocalStorageService.setEcommerceData(newData)

// Agregar item
LocalStorageService.addItem('products', newProduct)

// Actualizar item
LocalStorageService.updateItem('products', id, updatedProduct)

// Eliminar item
LocalStorageService.deleteItem('products', id)
```

### 2. Context de Ecommerce (`src/contexts/EcommerceContext.tsx`)
Context principal que gestiona todo el estado:

```typescript
import { useEcommerce, useProducts, useOrders, useCustomers } from '@/contexts/EcommerceContext'

// Hook principal
const { products, orders, customers, reviews, referrals } = useEcommerce()

// Hooks específicos
const { products, addProduct, updateProduct, deleteProduct } = useProducts()
const { orders, addOrder, updateOrder, deleteOrder } = useOrders()
const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers()
```

### 3. Hooks de Utilidad (`src/hooks/useEcommerceData.ts`)
Hooks especializados para operaciones específicas:

```typescript
import { useEcommerceStats, useEcommerceSearch, useEcommerceFilter } from '@/hooks/useEcommerceData'

// Estadísticas
const stats = useEcommerceStats()
console.log(`Total productos: ${stats.totalProducts}`)

// Búsqueda
const { searchProducts, searchOrders, searchCustomers } = useEcommerceSearch()
const products = searchProducts('iPhone')

// Filtros
const { getFilteredProducts } = useEcommerceFilter()
const electronicProducts = getFilteredProducts({ category: 'Electronics' })
```

## Cómo Usar el Sistema

### 1. Configuración (Ya incluida)
El sistema ya está configurado en `src/components/Providers.tsx`:

```typescript
<EcommerceProvider>
  <ReduxProvider>{children}</ReduxProvider>
</EcommerceProvider>
```

### 2. Usar en Componentes

#### Ejemplo: Lista de Productos
```typescript
'use client'

import { useProducts } from '@/contexts/EcommerceContext'

const ProductsList = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()

  const handleAddProduct = () => {
    addProduct({
      productName: 'Nuevo Producto',
      category: 'Electronics',
      stock: true,
      sku: 12345,
      price: '$99.99',
      qty: 10,
      status: 'Published',
      image: '',
      productBrand: 'Mi Marca'
    })
  }

  return (
    <div>
      <button onClick={handleAddProduct}>Agregar Producto</button>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.productName}</h3>
          <p>Precio: {product.price}</p>
          <button onClick={() => updateProduct(product.id, { stock: !product.stock })}>
            {product.stock ? 'Marcar Sin Stock' : 'Marcar En Stock'}
          </button>
          <button onClick={() => deleteProduct(product.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  )
}
```

#### Ejemplo: Estadísticas
```typescript
import { useEcommerceStats } from '@/hooks/useEcommerceData'

const StatsComponent = () => {
  const stats = useEcommerceStats()

  return (
    <div>
      <h2>Estadísticas de Ecommerce</h2>
      <p>Total Productos: {stats.totalProducts}</p>
      <p>Total Órdenes: {stats.totalOrders}</p>
      <p>Ingresos Totales: ${stats.totalRevenue.toFixed(2)}</p>
      <p>Promedio por Orden: ${stats.averageOrderValue.toFixed(2)}</p>
    </div>
  )
}
```

### 3. Operaciones Comunes

#### Agregar Producto
```typescript
const { addProduct } = useProducts()

addProduct({
  productName: 'iPhone 15',
  category: 'Electronics',
  stock: true,
  sku: 98765,
  price: '$999.99',
  qty: 50,
  status: 'Published',
  image: '/images/iphone15.jpg',
  productBrand: 'Apple'
})
```

#### Actualizar Stock
```typescript
const { updateProductStock } = useProducts()

updateProductStock(1, false, 0) // Marcar sin stock
updateProductStock(1, true, 25) // Marcar en stock con 25 unidades
```

#### Agregar Orden
```typescript
const { addOrder } = useOrders()

addOrder({
  order: '9999',
  customer: 'Juan Pérez',
  email: 'juan@example.com',
  avatar: '/images/avatar.jpg',
  payment: 1,
  status: 'Pending',
  spent: 150.00,
  method: 'mastercard',
  date: '2024/01/15',
  time: '10:30 AM',
  methodNumber: 1234
})
```

#### Exportar/Importar Datos
```typescript
const { exportData, importData, resetToInitialData } = useEcommerce()

// Exportar
const handleExport = () => {
  const data = exportData()
  if (data) {
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ecommerce-backup.json'
    a.click()
  }
}

// Importar
const handleImport = (jsonString: string) => {
  const success = importData(jsonString)
  if (success) {
    alert('Datos importados exitosamente')
  }
}

// Resetear a datos iniciales
const handleReset = () => {
  resetToInitialData()
}
```

## Ventajas del Sistema

1. **Persistencia Local**: Los datos se mantienen incluso después de cerrar el navegador
2. **Rendimiento**: No hay necesidad de llamadas al servidor para datos básicos
3. **Funcionalidad Offline**: La aplicación funciona sin conexión a internet
4. **Sincronización Automática**: Todos los componentes se actualizan automáticamente
5. **Fácil Backup**: Función de exportar/importar para respaldo de datos

## Archivos Importantes

- `src/utils/localStorage.ts` - Servicio base de localStorage
- `src/contexts/EcommerceContext.tsx` - Context principal
- `src/hooks/useEcommerceData.ts` - Hooks de utilidad
- `src/components/Providers.tsx` - Configuración de providers
- `src/components/examples/EcommerceExample.tsx` - Ejemplo completo de uso

## Notas Técnicas

- Los datos se guardan en la clave `ecommerce_data` en localStorage
- El sistema verifica automáticamente si localStorage está disponible
- Los datos se inicializan con los valores por defecto de `src/fake-db/apps/ecommerce.ts`
- Todos los cambios se sincronizan automáticamente con localStorage
- El sistema es compatible con SSR (Server-Side Rendering) de Next.js

## Ejemplo de Uso Completo

Ver `src/components/examples/EcommerceExample.tsx` para un ejemplo completo que incluye:
- Gestión de productos
- Gestión de órdenes
- Gestión de clientes
- Visualización de estadísticas
- Búsqueda y filtrado
- Exportar/importar datos
- Resetear a datos iniciales

¡Tu sistema de localStorage está listo para usar! 🚀 
