# Historial de Habitaciones y Clientes con localStorage

Sistema de gestión de historial de habitaciones y clientes implementado con React Context API y localStorage para persistencia automática de datos.

## Contextos Implementados

### 1. HistorialContext (`src/contexts/HistorialContext.tsx`)

Sistema completo para gestionar el historial de movimientos de habitaciones con persistencia automática.

#### Características:
- ✅ Persistencia automática en localStorage
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Estadísticas en tiempo real
- ✅ Filtros y búsqueda
- ✅ Exportar/Importar datos
- ✅ Datos no se pierden al hacer refresh

#### Funciones disponibles:
```typescript
// Funciones CRUD
agregarMovimiento(movimiento: Omit<HistorialHabitacion, 'id'>): void
actualizarMovimiento(id: number, movimiento: Partial<HistorialHabitacion>): void
eliminarMovimiento(id: number): void
obtenerMovimientoPorId(id: number): HistorialHabitacion | undefined

// Funciones de utilidad
obtenerHistorialPorHabitacion(habitacionId: number): HistorialHabitacion[]
obtenerHistorialPorTipo(tipo: TipoMovimiento): HistorialHabitacion[]
obtenerHistorialPorFecha(fecha: string): HistorialHabitacion[]
obtenerEstadisticas(): HistorialEstadisticas
buscarEnHistorial(termino: string): HistorialHabitacion[]

// Funciones de localStorage
exportarDatos(): string
importarDatos(datos: string): boolean
limpiarDatos(): void
```

### 2. ClientesContext (`src/contexts/ClientesContext.tsx`)

Sistema completo para gestionar clientes (DNI y RUC) con persistencia automática.

#### Características:
- ✅ Persistencia automática en localStorage
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Soporte para DNI y RUC
- ✅ Estadísticas en tiempo real
- ✅ Filtros y búsqueda
- ✅ Exportar/Importar datos
- ✅ Datos no se pierden al hacer refresh

#### Funciones disponibles:
```typescript
// Funciones CRUD
agregarCliente(cliente: Omit<Cliente, 'id' | 'fechaCreacion'>): void
actualizarCliente(id: number, cliente: Partial<Cliente>): void
eliminarCliente(id: number): void
obtenerClientePorId(id: number): Cliente | undefined

// Funciones de utilidad
obtenerClientesPorTipo(tipo: 'DNI' | 'RUC'): Cliente[]
obtenerClientesActivos(): Cliente[]
obtenerClientesInactivos(): Cliente[]
obtenerEstadisticas(): ClientesEstadisticas
buscarClientes(termino: string): Cliente[]

// Funciones de localStorage
exportarDatos(): string
importarDatos(datos: string): boolean
limpiarDatos(): void
```

## Estructura de Datos

### HistorialHabitacion
```typescript
interface HistorialHabitacion {
  id: number
  habitacionId: number
  habitacionNombre: string
  tipoMovimiento: TipoMovimiento
  estadoAnterior?: string
  estadoNuevo?: string
  huespedNombre?: string
  huespedDocumento?: string
  fecha: string
  hora: string
  observaciones?: string
  usuario?: string
}

type TipoMovimiento = 'cambio_estado' | 'check_in' | 'check_out' | 'reserva' | 'cancelacion'
```

### Cliente
```typescript
interface Cliente {
  id: number
  tipo_documento: 'DNI' | 'RUC'
  numero_documento: string

  // Datos para DNI (persona natural)
  nombres?: string
  apellido_paterno?: string
  apellido_materno?: string
  nombre_completo?: string
  codigo_verificacion?: string

  // Datos para RUC (empresa)
  nombre_o_razon_social?: string
  estado?: string
  condicion?: string
  direccion?: string
  direccion_completa?: string
  departamento?: string
  provincia?: string
  distrito?: string
  ubigeo_sunat?: string
  ubigeo?: string[]
  es_agente_de_retencion?: string
  es_buen_contribuyente?: string
  
  // Timestamps
  fechaCreacion?: string
  fechaActualizacion?: string
  fechaEliminacion?: string
}
```

## Uso de los Contextos

### Historial de Habitaciones

```typescript
import { useHistorial } from '@/contexts/HistorialContext'

const MiComponente = () => {
  const { 
    historial, 
    agregarMovimiento, 
    obtenerEstadisticas 
  } = useHistorial()

  const estadisticas = obtenerEstadisticas()

  const handleAgregarMovimiento = () => {
    agregarMovimiento({
      habitacionId: 101,
      habitacionNombre: 'Habitación 101',
      tipoMovimiento: 'check_in',
      estadoAnterior: 'reservada',
      estadoNuevo: 'ocupada',
      huespedNombre: 'Juan Pérez',
      huespedDocumento: '12345678',
      fecha: '2024-01-15',
      hora: '14:30',
      observaciones: 'Check-in normal',
      usuario: 'Recepcionista 1'
    })
  }

  return (
    <div>
      <p>Total movimientos: {estadisticas.totalMovimientos}</p>
      <p>Habitaciones activas: {estadisticas.habitacionesActivas}</p>
      <p>Movimientos hoy: {estadisticas.movimientosHoy}</p>
    </div>
  )
}
```

### Clientes

```typescript
import { useClientes } from '@/contexts/ClientesContext'

const MiComponenteClientes = () => {
  const { 
    clientes, 
    agregarCliente, 
    obtenerEstadisticas 
  } = useClientes()

  const estadisticas = obtenerEstadisticas()

  const handleAgregarCliente = () => {
    agregarCliente({
      tipo_documento: 'DNI',
      numero_documento: '12345678',
      nombres: 'Juan',
      apellido_paterno: 'Pérez',
      apellido_materno: 'García',
      nombre_completo: 'Pérez García, Juan',
      codigo_verificacion: '1'
    })
  }

  return (
    <div>
      <p>Total clientes: {estadisticas.totalClientes}</p>
      <p>Clientes DNI: {estadisticas.clientesDNI}</p>
      <p>Clientes RUC: {estadisticas.clientesRUC}</p>
    </div>
  )
}
```

## Hooks Especializados

### Para Historial
```typescript
// Hook para estadísticas
const estadisticas = useHistorialEstadisticas()

// Hook para historial por habitación
const historialHabitacion = useHistorialPorHabitacion(101)

// Hook para historial por tipo
const checkIns = useHistorialPorTipo('check_in')

// Hook para búsqueda
const resultados = useBuscarHistorial('Juan Pérez')
```

### Para Clientes
```typescript
// Hook para estadísticas
const estadisticas = useClientesEstadisticas()

// Hook para clientes por tipo
const clientesDNI = useClientesPorTipo('DNI')
const clientesRUC = useClientesPorTipo('RUC')

// Hook para búsqueda
const resultados = useBuscarClientes('Juan')
```

## Integración en la Aplicación

Los contextos están integrados en `src/components/Providers.tsx`:

```typescript
<HistorialProvider>
  <ClientesProvider>
    {children}
  </ClientesProvider>
</HistorialProvider>
```

## Componentes Actualizados

### Historial de Habitaciones
- ✅ `HistorialTable.tsx` - Tabla principal con datos del contexto
- ✅ `HistorialFilters.tsx` - Filtros usando contexto
- ✅ `index.tsx` - Página principal integrada

### Clientes
- ✅ `ClientListTable.tsx` - Tabla principal con datos del contexto
- ✅ `AddClientDrawer.tsx` - Formulario integrado con contexto
- ✅ `TableFilters.tsx` - Filtros usando contexto

## Claves localStorage

- **Historial**: `historial_habitaciones_data`
- **Clientes**: `clientes_data`

## Datos Iniciales

Si no hay datos en localStorage, se cargan datos de ejemplo:

### Historial (3 movimientos de ejemplo)
- Check-in Habitación 101
- Cambio de estado Habitación 102
- Check-out Habitación 101

### Clientes (2 clientes de ejemplo)
- Cliente DNI: Juan Pérez García
- Cliente RUC: EMPRESA DEMO S.A.C.

## Funcionalidades Adicionales

### Exportar/Importar
```typescript
// Exportar datos
const datosJSON = exportarDatos()

// Importar datos
const exito = importarDatos(datosJSON)
```

### Limpiar Datos
```typescript
limpiarDatos() // Elimina todos los datos del localStorage
```

### Estadísticas en Tiempo Real
Las estadísticas se calculan automáticamente cada vez que cambian los datos:

#### Historial
- Total de movimientos
- Movimientos por tipo
- Habitaciones activas
- Últimos 10 movimientos
- Movimientos del día

#### Clientes
- Total de clientes
- Clientes por tipo de documento
- Clientes activos/inactivos
- Últimos 5 clientes agregados

## Ventajas del Sistema

1. **Persistencia Automática**: Los datos se guardan automáticamente sin intervención manual
2. **Sin Pérdida de Datos**: Al hacer refresh, los datos persisten
3. **Rendimiento**: Acceso rápido a datos locales
4. **Offline**: Funciona sin conexión a internet
5. **Escalable**: Fácil de extender con nuevas funcionalidades
6. **Type Safety**: Completamente tipado con TypeScript
7. **Reactividad**: Los componentes se actualizan automáticamente

## Conclusión

Este sistema proporciona una solución completa y robusta para la gestión de historial de habitaciones y clientes con persistencia automática. Los datos se mantienen seguros en el navegador y la aplicación funciona de manera fluida y eficiente. 
