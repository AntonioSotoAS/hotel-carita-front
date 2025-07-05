# Sistema de Habitaciones con localStorage

## Descripción General

Este sistema gestiona las habitaciones del hotel con **persistencia automática** en localStorage. Todas las habitaciones, cambios de estado, check-ins, check-outs y reservas se guardan automáticamente y persisten al recargar la página.

## 🚀 Características Principales

### ✅ Persistencia Automática
- **localStorage automático**: Todos los datos se guardan al agregar/modificar habitaciones
- **Sin pérdida de datos**: Los datos persisten al hacer refresh del navegador
- **Sincronización en tiempo real**: Cambios se reflejan inmediatamente en la UI

### ✅ Gestión Hotelera Completa
- **Cambios de estado**: Vacia → Ocupada → En limpieza → Reservada
- **Check-in/Check-out**: Proceso completo con datos del huésped
- **Reservas**: Crear y gestionar reservas con fechas y horarios
- **Historial automático**: Integración con el sistema de historial

### ✅ Funcionalidades Avanzadas
- **Búsqueda en tiempo real**: Por nombre, estado, huésped
- **Filtros**: Por estado, disponibilidad
- **Estadísticas**: Ocupación, ingresos, disponibilidad
- **Validaciones**: Reservas próximas, estados válidos
- **Exportar/Importar**: Backup y restore de datos

## 🏗️ Arquitectura

### Contexto Principal
```typescript
// src/contexts/HabitacionesContext.tsx
interface HabitacionesContextType {
  habitaciones: Habitacion[]
  
  // CRUD básico
  agregarHabitacion: (habitacion: Omit<Habitacion, 'id'>) => void
  actualizarHabitacion: (id: number, habitacion: Partial<Habitacion>) => void
  eliminarHabitacion: (id: number) => void
  
  // Operaciones hoteleras
  cambiarEstadoHabitacion: (id: number, estado: Habitacion['estado']) => void
  realizarCheckIn: (id: number, checkInData: CheckInData) => void
  realizarCheckOut: (id: number, checkOutData: CheckOutData) => void
  crearReserva: (id: number, reservaData: ReservaData) => void
  
  // Utilidades
  obtenerEstadisticas: () => HabitacionesEstadisticas
  buscarHabitaciones: (termino: string) => Habitacion[]
  exportarDatos: () => string
  importarDatos: (datos: string) => boolean
}
```

### Tipo de Habitación
```typescript
interface Habitacion {
  id: number
  name: string
  estado: 'ocupada' | 'vacia' | 'en-limpieza' | 'reservada'
  precio?: number
  
  // Datos de reserva
  fechaReserva?: string
  horaReserva?: string
  
  // Datos de check-in/check-out
  fechaCheckIn?: string
  horaCheckIn?: string
  fechaCheckOut?: string
  horaCheckOut?: string
  
  // Datos del huésped
  huespedNombre?: string
  huespedDocumento?: string
  
  // Timestamps
  fechaCreacion?: string
  fechaActualizacion?: string
}
```

## 🎯 Uso del Sistema

### Hook Principal
```typescript
import { useHabitaciones } from '@/contexts/HabitacionesContext'

const MiComponente = () => {
  const { 
    habitaciones, 
    agregarHabitacion, 
    cambiarEstadoHabitacion,
    realizarCheckIn,
    realizarCheckOut,
    crearReserva
  } = useHabitaciones()
  
  // Usar las funciones...
}
```

### Agregar Nueva Habitación
```typescript
// Ejemplo de uso en AddRoomDrawer
const agregarNuevaHabitacion = (datos: FormData) => {
  agregarHabitacion({
    name: datos.name,
    estado: 'vacia',
    precio: datos.precio
  })
}
```

### Realizar Check-In
```typescript
const hacerCheckIn = (habitacionId: number) => {
  realizarCheckIn(habitacionId, {
    huespedNombre: 'Juan Pérez',
    huespedDocumento: '12345678',
    fechaCheckIn: '2024-01-17',
    horaCheckIn: '15:00'
  })
}
```

### Selección de Clientes en Check-In
El modal de check-in incluye un **autocomplete inteligente** que:
- Busca en la base de datos de clientes del localStorage
- Muestra clientes DNI y RUC con información clara
- Permite seleccionar un cliente existente o escribir uno nuevo
- Completa automáticamente nombre y documento
- Muestra indicadores visuales del tipo de documento

### Cambiar Estado
```typescript
const cambiarEstado = (habitacionId: number, nuevoEstado: string) => {
  cambiarEstadoHabitacion(habitacionId, nuevoEstado)
}
```

## 🛠️ Componentes Actualizados

### Componentes Principales
- **RoomListTable**: Tabla principal con gestión completa
- **AddRoomDrawer**: Formulario para agregar habitaciones
- **CheckInModal**: Modal para realizar check-in
- **CheckOutModal**: Modal para realizar check-out
- **ReservaModal**: Modal para crear reservas
- **TableFilters**: Filtros de búsqueda

### Integración con Historial
El sistema se integra automáticamente con el contexto de historial para registrar:
- Cambios de estado
- Check-ins y check-outs
- Creación y cancelación de reservas

### Integración con Clientes
El sistema se integra con el contexto de clientes para facilitar el proceso de check-in:
- **Autocomplete inteligente**: Busca y selecciona clientes existentes
- **Datos automáticos**: Completa nombre y documento automáticamente
- **Validación visual**: Muestra tipo de documento (DNI/RUC) con chips
- **Flexibilidad**: Permite escribir nuevos clientes o seleccionar existentes

## 🔧 Configuración

### 1. Providers
```typescript
// src/components/Providers.tsx
<HistorialProvider>
  <HabitacionesProvider>
    <ComponenteApp />
  </HabitacionesProvider>
</HistorialProvider>
```

### 2. Clave de localStorage
```typescript
const HABITACIONES_STORAGE_KEY = 'habitaciones_data'
```

### 3. Datos Iniciales
El sistema incluye habitaciones de ejemplo si no hay datos guardados:
- Habitación 101 (Vacía)
- Habitación 102 (En limpieza)
- Habitación 103 (Reservada)
- Habitación 201 (Ocupada)

## 📊 Estadísticas Disponibles

### Estadísticas Básicas
```typescript
interface HabitacionesEstadisticas {
  totalHabitaciones: number
  habitacionesVacias: number
  habitacionesOcupadas: number
  habitacionesReservadas: number
  habitacionesEnLimpieza: number
  ingresosPotenciales: number
  ocupacionPorcentaje: number
  proximasReservas: Habitacion[]
}
```

### Hooks Específicos
```typescript
// Estadísticas completas
const estadisticas = useHabitacionesEstadisticas()

// Habitaciones por estado
const habitacionesOcupadas = useHabitacionesPorEstado('ocupada')

// Búsqueda
const resultados = useBuscarHabitaciones('habitacion 101')
```

## 🎨 Características de UI

### Estados Visuales
- **Vacía**: Verde (tabler-bed-off)
- **Ocupada**: Rojo (tabler-user)
- **En Limpieza**: Amarillo (tabler-vacuum-cleaner)
- **Reservada**: Azul (tabler-calendar-check)

### Validaciones
- **Reservas próximas**: Bloquea cambios si la reserva es en menos de 3 horas
- **Estados válidos**: Solo permite transiciones lógicas
- **Formularios**: Validación completa con react-hook-form
- **Selección de clientes**: Validación automática de datos existentes

### Acciones Rápidas
- **Check-in**: Botón verde para habitaciones reservadas con autocomplete de clientes
- **Check-out**: Botón rojo para habitaciones ocupadas
- **Cambio de estado**: Dropdown directo en la tabla
- **Selección de clientes**: Autocomplete con búsqueda inteligente

## 🔄 Flujo de Trabajo

### 1. Reserva
```
Vacia → Reservada (con fecha/hora)
```

### 2. Check-in
```
Reservada → Ocupada (con datos del huésped)
```

### 3. Check-out
```
Ocupada → Vacia o En Limpieza (según opción)
```

### 4. Limpieza
```
En Limpieza → Vacia
```

## 💾 Persistencia

### Guardado Automático
- **Eventos**: Cada cambio se guarda automáticamente
- **Formato**: JSON en localStorage
- **Clave**: `habitaciones_data`

### Backup y Restore
```typescript
// Exportar datos
const datosBackup = exportarDatos()

// Importar datos
const exito = importarDatos(datosBackup)
```

## 🚨 Consideraciones Importantes

### Rendimiento
- **Optimizado**: useEffect con dependencias específicas
- **Debounce**: En búsquedas para evitar renders excesivos
- **Memoización**: Cálculos de estadísticas optimizados

### Seguridad
- **Validación**: Datos validados antes de guardar
- **Sanitización**: Limpieza de datos de entrada
- **Rollback**: Capacidad de revertir cambios

### Compatibilidad
- **localStorage**: Verificación de disponibilidad
- **Fallback**: Funcionamiento sin localStorage
- **Navegadores**: Compatible con todos los navegadores modernos

## 🎯 Próximas Mejoras

### Funcionalidades Planeadas
- [ ] Sincronización con servidor
- [ ] Notificaciones push para reservas
- [ ] Reportes avanzados
- [ ] Integración con sistema de pagos
- [ ] Gestión de precios dinámicos

### Optimizaciones
- [ ] Paginación para grandes volúmenes
- [ ] Cache inteligente
- [ ] Indexación de búsquedas
- [ ] Compresión de datos

---

## 📝 Ejemplo de Uso Completo

```typescript
import { useHabitaciones } from '@/contexts/HabitacionesContext'

const GestionHabitaciones = () => {
  const { 
    habitaciones, 
    agregarHabitacion,
    cambiarEstadoHabitacion,
    realizarCheckIn,
    obtenerEstadisticas,
    buscarHabitaciones 
  } = useHabitaciones()
  
  const estadisticas = obtenerEstadisticas()
  
  return (
    <div>
      <h2>Gestión de Habitaciones</h2>
      
      {/* Estadísticas */}
      <div>
        <p>Total: {estadisticas.totalHabitaciones}</p>
        <p>Ocupadas: {estadisticas.habitacionesOcupadas}</p>
        <p>Disponibles: {estadisticas.habitacionesVacias}</p>
        <p>Ocupación: {estadisticas.ocupacionPorcentaje}%</p>
      </div>
      
      {/* Lista de habitaciones */}
      {habitaciones.map(habitacion => (
        <div key={habitacion.id}>
          <h3>{habitacion.name}</h3>
          <p>Estado: {habitacion.estado}</p>
          <p>Precio: S/ {habitacion.precio}</p>
          {habitacion.huespedNombre && (
            <p>Huésped: {habitacion.huespedNombre}</p>
          )}
        </div>
      ))}
    </div>
  )
}
```

¡El sistema de habitaciones está listo para usar con persistencia automática en localStorage! 🎉 
