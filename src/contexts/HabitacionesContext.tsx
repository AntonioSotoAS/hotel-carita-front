'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useHistorial } from './HistorialContext'

// Types
interface Habitacion {
  id: number
  name: string
  estado: 'ocupada' | 'vacia' | 'en-limpieza' | 'reservada'
  precio?: number
  fechaReserva?: string
  horaReserva?: string
  fechaCheckIn?: string
  horaCheckIn?: string
  fechaCheckOut?: string
  horaCheckOut?: string
  huespedNombre?: string
  huespedDocumento?: string

  // Timestamps
  fechaCreacion?: string
  fechaActualizacion?: string
}

interface CheckInData {
  huespedNombre: string
  huespedDocumento: string
  fechaCheckIn: string
  horaCheckIn: string
}

interface CheckOutData {
  fechaCheckOut: string
  horaCheckOut: string
  requiereLimpieza: boolean
}

interface ReservaData {
  fechaReserva: string
  horaReserva: string
}

interface HabitacionesContextType {
  habitaciones: Habitacion[]
  isLoading: boolean

  // Funciones CRUD
  agregarHabitacion: (habitacion: Omit<Habitacion, 'id' | 'fechaCreacion'>) => void
  actualizarHabitacion: (id: number, habitacion: Partial<Habitacion>) => void
  eliminarHabitacion: (id: number) => void
  obtenerHabitacionPorId: (id: number) => Habitacion | undefined

  // Funciones específicas del hotel
  cambiarEstadoHabitacion: (id: number, nuevoEstado: Habitacion['estado'], usuario?: string) => void
  realizarCheckIn: (id: number, checkInData: CheckInData, usuario?: string) => void
  realizarCheckOut: (id: number, checkOutData: CheckOutData, usuario?: string) => void
  crearReserva: (id: number, reservaData: ReservaData, usuario?: string) => void
  cancelarReserva: (id: number, usuario?: string) => void

  // Funciones de utilidad
  obtenerHabitacionesPorEstado: (estado: Habitacion['estado']) => Habitacion[]
  obtenerHabitacionesDisponibles: () => Habitacion[]
  obtenerHabitacionesOcupadas: () => Habitacion[]
  obtenerEstadisticas: () => HabitacionesEstadisticas
  buscarHabitaciones: (termino: string) => Habitacion[]

  // Funciones de localStorage
  exportarDatos: () => string
  importarDatos: (datos: string) => boolean
  limpiarDatos: () => void
}

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

const HabitacionesContext = createContext<HabitacionesContextType | undefined>(undefined)

// Clave para localStorage
const HABITACIONES_STORAGE_KEY = 'habitaciones_data'

// Funciones de localStorage
const guardarEnStorage = (habitaciones: Habitacion[]) => {
  try {
    localStorage.setItem(HABITACIONES_STORAGE_KEY, JSON.stringify(habitaciones))
  } catch (error) {
    console.error('Error al guardar habitaciones en localStorage:', error)
  }
}

const cargarDesdeStorage = (): Habitacion[] => {
  try {
    const data = localStorage.getItem(HABITACIONES_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error al cargar habitaciones desde localStorage:', error)
    return []
  }
}

// Datos iniciales para habitaciones (si no hay datos en localStorage)
const habitacionesIniciales: Habitacion[] = [
  {
    id: 1,
    name: 'Habitación 101',
    estado: 'vacia',
    precio: 150.00,
    fechaCreacion: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Habitación 102',
    estado: 'en-limpieza',
    precio: 150.00,
    fechaCreacion: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Habitación 103',
    estado: 'reservada',
    precio: 180.00,
    fechaReserva: '2024-01-18',
    horaReserva: '15:00',
    fechaCreacion: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Habitación 201',
    estado: 'ocupada',
    precio: 200.00,
    huespedNombre: 'María García',
    huespedDocumento: '87654321',
    fechaCheckIn: '2024-01-16',
    horaCheckIn: '16:00',
    fechaCreacion: new Date().toISOString()
  }
]

interface HabitacionesProviderProps {
  children: ReactNode
}

export const HabitacionesProvider = ({ children }: HabitacionesProviderProps) => {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Obtener funciones del historial en el nivel superior
  let agregarMovimientoHistorial: ((movimiento: any) => void) | null = null
  try {
    const historialContext = useHistorial()
    agregarMovimientoHistorial = historialContext.agregarMovimiento
  } catch (error) {
    // El contexto de historial no está disponible
    agregarMovimientoHistorial = null
  }

  // Cargar habitaciones al inicializar
  useEffect(() => {
    const habitacionesGuardadas = cargarDesdeStorage()
    if (habitacionesGuardadas.length > 0) {
      setHabitaciones(habitacionesGuardadas)
    } else {
      // Si no hay datos guardados, usar datos iniciales
      setHabitaciones(habitacionesIniciales)
      guardarEnStorage(habitacionesIniciales)
    }
    setIsLoading(false)
  }, [])

  // Guardar habitaciones cuando cambie
  useEffect(() => {
    if (!isLoading && habitaciones.length > 0) {
      guardarEnStorage(habitaciones)
    }
  }, [habitaciones, isLoading])

  // Funciones CRUD
  const agregarHabitacion = (nuevaHabitacion: Omit<Habitacion, 'id' | 'fechaCreacion'>) => {
    const maxId = habitaciones.reduce((max, habitacion) => Math.max(max, habitacion.id), 0)
    const habitacion: Habitacion = {
      ...nuevaHabitacion,
      id: maxId + 1,
      fechaCreacion: new Date().toISOString()
    }

    setHabitaciones(prev => [...prev, habitacion])
  }

  const actualizarHabitacion = (id: number, habitacionActualizada: Partial<Habitacion>) => {
    setHabitaciones(prev => prev.map(habitacion =>
      habitacion.id === id
        ? { ...habitacion, ...habitacionActualizada, fechaActualizacion: new Date().toISOString() }
        : habitacion
    ))
  }

  const eliminarHabitacion = (id: number) => {
    setHabitaciones(prev => prev.filter(habitacion => habitacion.id !== id))
  }

  const obtenerHabitacionPorId = (id: number): Habitacion | undefined => {
    return habitaciones.find(habitacion => habitacion.id === id)
  }

  // Funciones específicas del hotel con integración de historial
  const cambiarEstadoHabitacion = (id: number, nuevoEstado: Habitacion['estado'], usuario: string = 'Sistema') => {
    const habitacion = obtenerHabitacionPorId(id)
    if (!habitacion) return

    const estadoAnterior = habitacion.estado

    // Actualizar habitación
    actualizarHabitacion(id, { estado: nuevoEstado })

        // Registrar en historial si está disponible
    if (agregarMovimientoHistorial) {
      agregarMovimientoHistorial({
        habitacionId: habitacion.id,
        habitacionNombre: habitacion.name,
        tipoMovimiento: 'cambio_estado',
        estadoAnterior: estadoAnterior,
        estadoNuevo: nuevoEstado,
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
        observaciones: `Cambio de estado de ${estadoAnterior} a ${nuevoEstado}`,
        usuario: usuario
      })
    }
  }

  const realizarCheckIn = (id: number, checkInData: CheckInData, usuario: string = 'Recepcionista') => {
    const habitacion = obtenerHabitacionPorId(id)
    if (!habitacion) return

    const estadoAnterior = habitacion.estado

    // Actualizar habitación
    actualizarHabitacion(id, {
      estado: 'ocupada',
      ...checkInData,
      // Limpiar datos de reserva si existían
      fechaReserva: undefined,
      horaReserva: undefined
    })

        // Registrar en historial si está disponible
    if (agregarMovimientoHistorial) {
      agregarMovimientoHistorial({
        habitacionId: habitacion.id,
        habitacionNombre: habitacion.name,
        tipoMovimiento: 'check_in',
        estadoAnterior: estadoAnterior,
        estadoNuevo: 'ocupada',
        huespedNombre: checkInData.huespedNombre,
        huespedDocumento: checkInData.huespedDocumento,
        fecha: checkInData.fechaCheckIn,
        hora: checkInData.horaCheckIn,
        observaciones: `Check-in realizado para ${checkInData.huespedNombre}`,
        usuario: usuario
      })
    }
  }

  const realizarCheckOut = (id: number, checkOutData: CheckOutData, usuario: string = 'Recepcionista') => {
    const habitacion = obtenerHabitacionPorId(id)
    if (!habitacion) return

    const nuevoEstado = checkOutData.requiereLimpieza ? 'en-limpieza' : 'vacia'

    // Actualizar habitación
    actualizarHabitacion(id, {
      estado: nuevoEstado,
      fechaCheckOut: checkOutData.fechaCheckOut,
      horaCheckOut: checkOutData.horaCheckOut,
      // Limpiar datos del huésped
      huespedNombre: undefined,
      huespedDocumento: undefined
    })

        // Registrar en historial si está disponible
    if (agregarMovimientoHistorial) {
      agregarMovimientoHistorial({
        habitacionId: habitacion.id,
        habitacionNombre: habitacion.name,
        tipoMovimiento: 'check_out',
        estadoAnterior: 'ocupada',
        estadoNuevo: nuevoEstado,
        huespedNombre: habitacion.huespedNombre,
        huespedDocumento: habitacion.huespedDocumento,
        fecha: checkOutData.fechaCheckOut,
        hora: checkOutData.horaCheckOut,
        observaciones: `Check-out realizado${checkOutData.requiereLimpieza ? ', requiere limpieza' : ''}`,
        usuario: usuario
      })
    }
  }

  const crearReserva = (id: number, reservaData: ReservaData, usuario: string = 'Recepcionista') => {
    const habitacion = obtenerHabitacionPorId(id)
    if (!habitacion) return

    const estadoAnterior = habitacion.estado

    // Actualizar habitación
    actualizarHabitacion(id, {
      estado: 'reservada',
      ...reservaData,
      // Limpiar datos de huésped previos si existían
      huespedNombre: undefined,
      huespedDocumento: undefined,
      fechaCheckIn: undefined,
      horaCheckIn: undefined
    })

        // Registrar en historial si está disponible
    if (agregarMovimientoHistorial) {
      agregarMovimientoHistorial({
        habitacionId: habitacion.id,
        habitacionNombre: habitacion.name,
        tipoMovimiento: 'reserva',
        estadoAnterior: estadoAnterior,
        estadoNuevo: 'reservada',
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
        observaciones: `Reserva creada para ${reservaData.fechaReserva} a las ${reservaData.horaReserva}`,
        usuario: usuario
      })
    }
  }

  const cancelarReserva = (id: number, usuario: string = 'Recepcionista') => {
    const habitacion = obtenerHabitacionPorId(id)
    if (!habitacion || habitacion.estado !== 'reservada') return

    // Actualizar habitación
    actualizarHabitacion(id, {
      estado: 'vacia',
      fechaReserva: undefined,
      horaReserva: undefined
    })

        // Registrar en historial si está disponible
    if (agregarMovimientoHistorial) {
      agregarMovimientoHistorial({
        habitacionId: habitacion.id,
        habitacionNombre: habitacion.name,
        tipoMovimiento: 'cancelacion',
        estadoAnterior: 'reservada',
        estadoNuevo: 'vacia',
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
        observaciones: 'Reserva cancelada',
        usuario: usuario
      })
    }
  }

  // Funciones de utilidad
  const obtenerHabitacionesPorEstado = (estado: Habitacion['estado']): Habitacion[] => {
    return habitaciones.filter(habitacion => habitacion.estado === estado)
  }

  const obtenerHabitacionesDisponibles = (): Habitacion[] => {
    return habitaciones.filter(habitacion => habitacion.estado === 'vacia')
  }

  const obtenerHabitacionesOcupadas = (): Habitacion[] => {
    return habitaciones.filter(habitacion => habitacion.estado === 'ocupada')
  }

  const obtenerEstadisticas = (): HabitacionesEstadisticas => {
    const vacias = habitaciones.filter(h => h.estado === 'vacia').length
    const ocupadas = habitaciones.filter(h => h.estado === 'ocupada').length
    const reservadas = habitaciones.filter(h => h.estado === 'reservada').length
    const enLimpieza = habitaciones.filter(h => h.estado === 'en-limpieza').length

    const ingresosPotenciales = habitaciones
      .filter(h => h.estado === 'ocupada' && h.precio)
      .reduce((total, h) => total + (h.precio || 0), 0)

    const ocupacionPorcentaje = habitaciones.length > 0 ?
      Math.round((ocupadas / habitaciones.length) * 100) : 0

    const proximasReservas = habitaciones
      .filter(h => h.estado === 'reservada')
      .sort((a, b) => {
        const dateA = new Date(`${a.fechaReserva}T${a.horaReserva}`)
        const dateB = new Date(`${b.fechaReserva}T${b.horaReserva}`)
        return dateA.getTime() - dateB.getTime()
      })
      .slice(0, 5)

    return {
      totalHabitaciones: habitaciones.length,
      habitacionesVacias: vacias,
      habitacionesOcupadas: ocupadas,
      habitacionesReservadas: reservadas,
      habitacionesEnLimpieza: enLimpieza,
      ingresosPotenciales,
      ocupacionPorcentaje,
      proximasReservas
    }
  }

  const buscarHabitaciones = (termino: string): Habitacion[] => {
    const terminoLower = termino.toLowerCase()
    return habitaciones.filter(habitacion =>
      habitacion.name.toLowerCase().includes(terminoLower) ||
      habitacion.estado.toLowerCase().includes(terminoLower) ||
      habitacion.huespedNombre?.toLowerCase().includes(terminoLower) ||
      habitacion.huespedDocumento?.toLowerCase().includes(terminoLower)
    )
  }

  // Funciones de localStorage
  const exportarDatos = (): string => {
    return JSON.stringify(habitaciones, null, 2)
  }

  const importarDatos = (datos: string): boolean => {
    try {
      const habitacionesImportadas = JSON.parse(datos) as Habitacion[]

      // Validar que sean habitaciones válidas
      const habitacionesValidas = habitacionesImportadas.filter(habitacion =>
        habitacion.id && habitacion.name && habitacion.estado
      )

      if (habitacionesValidas.length > 0) {
        setHabitaciones(habitacionesValidas)
        return true
      }

      return false
    } catch (error) {
      console.error('Error al importar habitaciones:', error)
      return false
    }
  }

  const limpiarDatos = () => {
    setHabitaciones([])
    localStorage.removeItem(HABITACIONES_STORAGE_KEY)
  }

  const value: HabitacionesContextType = {
    habitaciones,
    isLoading,
    agregarHabitacion,
    actualizarHabitacion,
    eliminarHabitacion,
    obtenerHabitacionPorId,
    cambiarEstadoHabitacion,
    realizarCheckIn,
    realizarCheckOut,
    crearReserva,
    cancelarReserva,
    obtenerHabitacionesPorEstado,
    obtenerHabitacionesDisponibles,
    obtenerHabitacionesOcupadas,
    obtenerEstadisticas,
    buscarHabitaciones,
    exportarDatos,
    importarDatos,
    limpiarDatos
  }

  return (
    <HabitacionesContext.Provider value={value}>
      {children}
    </HabitacionesContext.Provider>
  )
}

// Hook para usar el contexto
export const useHabitaciones = () => {
  const context = useContext(HabitacionesContext)
  if (context === undefined) {
    throw new Error('useHabitaciones debe ser usado dentro de un HabitacionesProvider')
  }
  return context
}

// Hooks específicos para diferentes operaciones
export const useHabitacionesEstadisticas = () => {
  const { obtenerEstadisticas } = useHabitaciones()
  return obtenerEstadisticas()
}

export const useHabitacionesPorEstado = (estado: Habitacion['estado']) => {
  const { obtenerHabitacionesPorEstado } = useHabitaciones()
  return obtenerHabitacionesPorEstado(estado)
}

export const useBuscarHabitaciones = (termino: string) => {
  const { buscarHabitaciones } = useHabitaciones()
  return buscarHabitaciones(termino)
}

// Exportar tipo Habitacion para uso en otros archivos
export type { Habitacion, CheckInData, CheckOutData, ReservaData }
