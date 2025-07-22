# Funcionalidades de Exportación - Hotel Carita Frontend

## 📊 Descripción

Este módulo proporciona funcionalidades completas de exportación para productos, clientes y estadísticas en formatos Excel (.xlsx) y PDF (.pdf).

## 🚀 Características

- ✅ **Exportación a Excel** con formato profesional
- ✅ **Exportación a PDF real** con archivos .pdf nativos
- ✅ **Menús desplegables** para mejor UX
- ✅ **Formato de moneda** en Soles (S/.)
- ✅ **Fechas localizadas** en formato peruano
- ✅ **Información contextual** en los menús
- ✅ **Iconos descriptivos** para cada opción

## 📦 Dependencias Instaladas

```bash
npm install xlsx jspdf jspdf-autotable
```

- **xlsx**: Para generar archivos Excel
- **jspdf**: Para generar archivos PDF reales
- **jspdf-autotable**: Para crear tablas en PDF

## 🎯 Componentes Disponibles

### 1. **ExportMenu** (Productos)
```tsx
import ExportMenu from './ExportMenu'

<ExportMenu productos={productos} />
```

### 2. **ExportClienteMenu** (Clientes)
```tsx
import ExportClienteMenu from './ExportClienteMenu'

<ExportClienteMenu clientes={clientes} />
```

### 3. **ExportEstadisticasMenu** (Estadísticas)
```tsx
import ExportEstadisticasMenu from '@/components/ExportEstadisticasMenu'

<ExportEstadisticasMenu estadisticas={estadisticas} />
```

### 4. **ExportHistorialMenu** (Historial de Habitaciones)
```tsx
import ExportHistorialMenu from './ExportHistorialMenu'

<ExportHistorialMenu historial={historial} />
```

### 5. **ExportStockMenu** (Historial de Stock)
```tsx
import ExportStockMenu from './ExportStockMenu'

<ExportStockMenu stockHistory={stockHistory} />
```

## 📋 Funciones de Exportación

### **exportProductos(productos, format)**
Exporta la lista de productos.

**Parámetros:**
- `productos`: Array de productos
- `format`: 'excel' | 'pdf'

**Campos incluidos:**
- ID, Nombre, Descripción, SKU, Categoría
- Precio (formato S/.), Stock, Stock Mínimo
- Estado, Fecha de Creación

### **exportClientes(clientes, format)**
Exporta la lista de clientes.

**Parámetros:**
- `clientes`: Array de clientes
- `format`: 'excel' | 'pdf'

**Campos incluidos:**
- ID, Tipo de Documento, Número de Documento
- Nombre/Razón Social (formateado según tipo)
- Email, Teléfono, Dirección, Estado
- Fecha de Creación

### **exportEstadisticas(estadisticas, format)**
Exporta estadísticas del sistema.

**Parámetros:**
- `estadisticas`: Objeto con estadísticas
- `format`: 'excel' | 'pdf'

**Métricas incluidas:**
- Total Productos, Productos Activos, Bajo Stock
- Valor Total Inventario (S/.)
- Total Clientes, DNI, RUC, Activos, Inactivos

### **exportHistorial(historial, format)**
Exporta el historial de habitaciones.

**Parámetros:**
- `historial`: Array de registros de historial
- `format`: 'excel' | 'pdf'

**Campos incluidos:**
- Fecha, Hora, Habitación, Tipo de Movimiento
- Estado Anterior, Estado Nuevo
- Huésped, Documento Huésped, Observaciones, Usuario

### **exportEstadisticasHistorial(historial, format)**
Exporta estadísticas del historial de habitaciones.

**Parámetros:**
- `historial`: Array de registros de historial
- `format`: 'excel' | 'pdf'

**Métricas incluidas:**
- Total de Registros, Check-Ins, Check-Outs
- Reservas, Cancelaciones, Cambios de Estado
- Habitaciones Involucradas, Huéspedes Únicos, Usuarios del Sistema

### **exportStockHistory(stockHistory, format)**
Exporta el historial de movimientos de stock.

**Parámetros:**
- `stockHistory`: Array de movimientos de stock
- `format`: 'excel' | 'pdf'

**Campos incluidos:**
- ID, Fecha, Hora, Producto, ID Producto
- Tipo de Movimiento (Entrada/Salida), Cantidad
- Stock Anterior, Stock Actual, Motivo, Observaciones, Usuario

### **exportEstadisticasStock(stockHistory, format)**
Exporta estadísticas del historial de stock.

**Parámetros:**
- `stockHistory`: Array de movimientos de stock
- `format`: 'excel' | 'pdf'

**Métricas incluidas:**
- Total de Movimientos, Entradas, Salidas
- Cantidad Total Entradas/Salidas, Balance Neto
- Productos Involucrados, Usuarios del Sistema, Tipos de Motivos

## 🎨 Características de los Archivos

### **Excel (.xlsx)**
- ✅ Títulos descriptivos
- ✅ Formato de moneda (S/.)
- ✅ Fechas localizadas
- ✅ Nombres de columnas en español
- ✅ Separación visual con filas vacías
- ✅ Nombres de archivo con fecha

### **PDF (.pdf)**
- ✅ Título del reporte
- ✅ Fecha de generación
- ✅ Tablas con colores alternados
- ✅ Encabezados destacados
- ✅ Formato compacto y legible
- ✅ Nombres de archivo con fecha
- ✅ Archivos PDF nativos descargados directamente

## 📁 Estructura de Archivos

```
src/
├── utils/
│   ├── exportUtils.ts              # Funciones con jsPDF (experimental)
│   ├── exportUtilsSimple.ts        # Funciones simplificadas (HTML)
│   ├── exportHistorialUtils.ts     # Funciones para historial (HTML)
│   ├── exportStockUtils.ts         # Funciones para stock (HTML)
│   └── exportPDFUtils.ts           # Funciones para PDF reales (recomendado)
├── views/apps/productos/list/
│   └── ExportMenu.tsx              # Menú para productos
├── views/apps/clientes/list/
│   └── ExportClienteMenu.tsx       # Menú para clientes
├── views/apps/habitaciones/historial/
│   └── ExportHistorialMenu.tsx     # Menú para historial
├── views/apps/stock/list/
│   └── ExportStockMenu.tsx         # Menú para stock
└── components/
    └── ExportEstadisticasMenu.tsx  # Menú para estadísticas
```

## 🔧 Uso en Componentes

### **Ejemplo en Tabla de Productos:**
```tsx
import ExportMenu from './ExportMenu'

// En el JSX
<ExportMenu productos={productos} />
```

### **Ejemplo en Dashboard:**
```tsx
import ExportEstadisticasMenu from '@/components/ExportEstadisticasMenu'

// En el JSX
<ExportEstadisticasMenu 
  estadisticas={estadisticas} 
  size="small" 
  variant="contained" 
/>
```

### **Ejemplo en Historial de Habitaciones:**
```tsx
import ExportHistorialMenu from './ExportHistorialMenu'

// En el JSX
<ExportHistorialMenu historial={historial} />
```

### **Ejemplo en Historial de Stock:**
```tsx
import ExportStockMenu from './ExportStockMenu'

// En el JSX
<ExportStockMenu stockHistory={stockHistory} />
```

## 📊 Formato de Datos

### **Productos:**
```typescript
{
  ID: 1,
  Nombre: "Coca Cola 500ml",
  Descripción: "Bebida gaseosa",
  SKU: "CC500",
  Categoría: "Bebidas",
  Precio: "S/. 3.50",
  Stock: 100,
  "Stock Mínimo": 10,
  Estado: "Activo",
  "Fecha Creación": "01/01/2024"
}
```

### **Clientes:**
```typescript
{
  ID: 1,
  "Tipo Documento": "DNI",
  "Número Documento": "12345678",
  "Nombre/Razón Social": "Pérez García, Juan Carlos",
  Email: "juan@ejemplo.com",
  Teléfono: "+51 999 999 999",
  Dirección: "Lima, Perú",
  Estado: "Activo",
  "Fecha Creación": "01/01/2024"
}
```

### **Estadísticas:**
```typescript
{
  "Métrica": "Total Productos",
  "Valor": 150
}
```

### **Historial de Habitaciones:**
```typescript
{
  Fecha: "15/01/2024",
  Hora: "14:30",
  Habitación: "Habitación 101",
  "Tipo de Movimiento": "Check-In",
  "Estado Anterior": "Disponible",
  "Estado Nuevo": "Ocupada",
  Huésped: "Juan Pérez",
  "Documento Huésped": "12345678",
  Observaciones: "Check-in exitoso",
  Usuario: "admin"
}
```

### **Historial de Stock:**
```typescript
{
  ID: 1,
  Fecha: "15/01/2024",
  Hora: "10:30",
  Producto: "Laptop HP Pavilion",
  "ID Producto": 1,
  "Tipo de Movimiento": "ENTRADA",
  Cantidad: "+50",
  "Stock Anterior": 0,
  "Stock Actual": 50,
  Motivo: "Compra inicial",
  Observaciones: "Primer lote de laptops",
  Usuario: "Admin"
}
```

## 🎯 Características Avanzadas

### **Formato de Moneda**
- Todos los precios se muestran en Soles (S/.)
- Formato: `S/. 1,234.56`

### **Fechas Localizadas**
- Formato peruano: `DD/MM/YYYY`
- Ejemplo: `15/01/2024`

### **Nombres de Archivo**
- Incluyen fecha de exportación
- Formato: `productos-2024-01-15.xlsx`

### **Información Contextual**
- Los menús muestran cantidad de registros
- Descripción de lo que se exportará
- Iconos descriptivos para cada formato

## 🚀 Próximos Pasos

1. **Exportación filtrada**: Exportar solo productos/clientes filtrados
2. **Plantillas personalizadas**: Diferentes formatos según necesidades
3. **Exportación programada**: Generar reportes automáticos
4. **Compresión**: Archivos ZIP para múltiples formatos
5. **Envío por email**: Integración con sistema de correo

## 🔍 Solución de Problemas

### **Error: "Property 'autoTable' does not exist"**
Si usas la versión con jsPDF, agrega esta declaración:
```typescript
// Agregar esta declaración en exportUtils.ts
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}
```

**Solución recomendada:** Usar `exportUtilsSimple.ts` que no requiere jsPDF.

### **Error: "Cannot find module 'xlsx'"**
```bash
npm install xlsx jspdf jspdf-autotable
```

### **Archivos no se descargan**
- Verificar permisos del navegador
- Asegurar que no hay bloqueadores de popups
- Verificar que el navegador soporta las APIs

## 📝 Notas de Desarrollo

- Los archivos se generan en el navegador del cliente
- No se requiere servidor para la exportación
- Compatible con todos los navegadores modernos
- Los archivos se descargan automáticamente
- **Excel**: Archivos .xlsx nativos
- **PDF**: Archivos .pdf nativos generados con jsPDF
- Formato optimizado para impresión y distribución

## 🎨 Personalización

### **Cambiar Colores del PDF:**
```typescript
headStyles: {
  fillColor: [66, 139, 202], // Azul
  textColor: 255,
  fontStyle: 'bold'
}
```

### **Cambiar Formato de Fecha:**
```typescript
new Date().toLocaleDateString('es-PE')
```

### **Agregar Logo:**
```typescript
doc.addImage(logo, 'PNG', 14, 10, 30, 10)
``` 
