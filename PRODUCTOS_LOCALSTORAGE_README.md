# Sistema de Productos con localStorage

## 🚀 Descripción

Sistema completo de gestión de productos que utiliza localStorage para mantener la persistencia de datos. Los productos se guardan automáticamente en el navegador y se mantienen incluso después de hacer refresh o cerrar la página.

## ✨ Características Principales

- **Persistencia automática**: Los datos se guardan automáticamente en localStorage
- **Sin pérdida de datos**: Los productos se mantienen al hacer refresh
- **Gestión completa CRUD**: Crear, leer, actualizar y eliminar productos
- **Estadísticas en tiempo real**: Métricas calculadas automáticamente
- **Búsqueda y filtrado**: Encuentra productos rápidamente
- **Exportar/Importar**: Backup y restore de datos
- **Alertas de stock**: Notificaciones para productos con bajo stock

## 📁 Archivos del Sistema

```
src/
├── contexts/
│   └── ProductosContext.tsx          # Context principal con localStorage
├── views/apps/productos/list/
│   ├── index.tsx                     # Página principal
│   ├── UserListCards.tsx             # Tarjetas de estadísticas
│   ├── AddProductDrawer.tsx          # Formulario para agregar productos
│   └── ProductListTable.tsx         # Tabla de productos
├── types/
│   └── backend.types.ts              # Tipos TypeScript
└── components/
    └── Providers.tsx                 # Configuración de providers
```

## 🔧 Configuración

### 1. El sistema ya está configurado automáticamente

El `ProductosProvider` está integrado en `src/components/Providers.tsx`:

```typescript
<ProductosProvider>
  <ReduxProvider>{children}</ReduxProvider>
</ProductosProvider>
```

### 2. Tipo de Producto

```typescript
interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  stock: number;
  precio?: number;
  sku?: string;
  categoria?: string;
  stock_minimo: number;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaEliminacion?: string;
}
```

## 🎯 Cómo Usar

### 1. Hook Principal

```typescript
import { useProductos } from '@/contexts/ProductosContext'

const MiComponente = () => {
  const { 
    productos, 
    agregarProducto, 
    actualizarProducto, 
    eliminarProducto 
  } = useProductos()

  // Los productos se cargan automáticamente desde localStorage
  console.log('Productos:', productos)
}
```

### 2. Agregar Producto

```typescript
const { agregarProducto } = useProductos()

const nuevoProducto = {
  nombre: 'Coca Cola 500ml',
  descripcion: 'Bebida gaseosa',
  stock: 50,
  precio: 2.50,
  sku: 'CC500',
  categoria: 'Bebidas',
  stock_minimo: 10,
  activo: true,
  fechaCreacion: new Date().toISOString(),
  fechaActualizacion: new Date().toISOString()
}

// Se guarda automáticamente en localStorage
agregarProducto(nuevoProducto)
```

### 3. Actualizar Producto

```typescript
const { actualizarProducto } = useProductos()

// Actualizar stock
actualizarProducto(1, { stock: 25 })

// Actualizar precio
actualizarProducto(1, { precio: 3.00 })

// Desactivar producto
actualizarProducto(1, { activo: false })
```

### 4. Obtener Estadísticas

```typescript
import { useProductosEstadisticas } from '@/contexts/ProductosContext'

const MiComponente = () => {
  const estadisticas = useProductosEstadisticas()

  return (
    <div>
      <p>Total: {estadisticas.totalProductos}</p>
      <p>Activos: {estadisticas.productosActivos}</p>
      <p>Bajo Stock: {estadisticas.productosBajoStock}</p>
      <p>Valor Total: ${estadisticas.valorTotalInventario}</p>
    </div>
  )
}
```

### 5. Buscar Productos

```typescript
import { useBuscarProductos } from '@/contexts/ProductosContext'

const BuscadorProductos = () => {
  const [termino, setTermino] = useState('')
  const resultados = useBuscarProductos(termino)

  return (
    <div>
      <input 
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        placeholder="Buscar productos..."
      />
      {resultados.map(producto => (
        <div key={producto.id}>{producto.nombre}</div>
      ))}
    </div>
  )
}
```

## 📊 Funcionalidades Avanzadas

### 1. Productos por Categoría

```typescript
import { useProductosPorCategoria } from '@/contexts/ProductosContext'

const ProductosPorCategoria = ({ categoria }: { categoria: string }) => {
  const productos = useProductosPorCategoria(categoria)
  
  return (
    <div>
      <h3>{categoria}</h3>
      {productos.map(producto => (
        <div key={producto.id}>{producto.nombre}</div>
      ))}
    </div>
  )
}
```

### 2. Productos con Bajo Stock

```typescript
import { useProductosBajoStock } from '@/contexts/ProductosContext'

const AlertasBajoStock = () => {
  const productosBajoStock = useProductosBajoStock()
  
  if (productosBajoStock.length === 0) {
    return <div>✅ Todos los productos tienen stock suficiente</div>
  }

  return (
    <div>
      <h3>⚠️ Productos con Bajo Stock</h3>
      {productosBajoStock.map(producto => (
        <div key={producto.id}>
          {producto.nombre} - Stock: {producto.stock} (Mínimo: {producto.stock_minimo})
        </div>
      ))}
    </div>
  )
}
```

### 3. Exportar/Importar Datos

```typescript
const { exportarDatos, importarDatos, limpiarDatos } = useProductos()

// Exportar
const handleExportar = () => {
  const datos = exportarDatos()
  const blob = new Blob([datos], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'productos-backup.json'
  a.click()
}

// Importar
const handleImportar = (archivo: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const datos = e.target?.result as string
    if (importarDatos(datos)) {
      alert('Productos importados exitosamente')
    } else {
      alert('Error al importar productos')
    }
  }
  reader.readAsText(archivo)
}

// Limpiar todos los datos
const handleLimpiar = () => {
  if (confirm('¿Estás seguro?')) {
    limpiarDatos()
  }
}
```

## 🎨 Componentes Disponibles

### 1. UserListCards
Muestra estadísticas en tarjetas:
- Total de productos
- Productos activos
- Productos con bajo stock
- Valor total del inventario

### 2. AddProductDrawer
Formulario lateral para agregar productos con validación:
- Campos obligatorios y opcionales
- Validación de datos
- Generación automática de SKU
- Categorías predefinidas

### 3. ProductListTable
Tabla completa con:
- Búsqueda en tiempo real
- Paginación
- Acciones por fila (activar/desactivar, editar stock)
- Exportar/importar datos
- Indicadores de estado de stock

## 🔧 Personalización

### Agregar Nuevas Categorías

En `AddProductDrawer.tsx`:

```typescript
const categorias = [
  'Bebidas',
  'Snacks',
  'Dulces',
  'Bebidas Calientes',
  'Higiene',
  'Comida',
  'Electrónicos',
  'Tu Nueva Categoría', // Agregar aquí
  'Otros'
]
```

### Modificar Validaciones

En `AddProductDrawer.tsx`, personaliza las reglas de validación:

```typescript
<Controller
  name='nombre'
  control={control}
  rules={{
    required: 'Este campo es requerido',
    minLength: {
      value: 2,
      message: 'El nombre debe tener al menos 2 caracteres'
    },
    // Agregar más validaciones aquí
  }}
  // ...
/>
```

## 📈 Ventajas del Sistema

1. **Offline First**: Funciona sin conexión a internet
2. **Rápido**: No hay latencia de red para operaciones básicas
3. **Confiable**: Los datos se mantienen en el navegador del usuario
4. **Escalable**: Puede manejar miles de productos eficientemente
5. **Fácil de usar**: API simple y consistente

## 🚨 Consideraciones

- **Límite de localStorage**: Aproximadamente 5-10MB por dominio
- **Datos por navegador**: Los datos son específicos del navegador
- **Backup recomendado**: Usa la función de exportar regularmente

## 🎯 Ejemplos de Uso

Para ver el sistema completo en acción:

1. Ve a `/apps/productos/list`
2. Agrega algunos productos
3. Haz refresh de la página
4. ¡Los productos siguen ahí! 🎉

¡Tu sistema de productos con localStorage está listo para usar! 🚀 
