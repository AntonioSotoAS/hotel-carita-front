'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { HistorialHabitacion, TipoMovimiento, FiltrosHistorial } from '@/views/apps/habitaciones/historial/types'

interface HistorialContextType {
  historial: HistorialHabitacion[]
  isLoading: boolean

  // Funciones CRUD
  agregarMovimiento: (movimiento: Omit<HistorialHabitacion, 'id'>) => void
  actualizarMovimiento: (id: number, movimiento: Partial<HistorialHabitacion>) => void
  eliminarMovimiento: (id: number) => void
  obtenerMovimientoPorId: (id: number) => HistorialHabitacion | undefined

  // Funciones de utilidad
  obtenerHistorialPorHabitacion: (habitacionId: number) => HistorialHabitacion[]
  obtenerHistorialPorTipo: (tipo: TipoMovimiento) => HistorialHabitacion[]
  obtenerHistorialPorFecha: (fecha: string) => HistorialHabitacion[]
  obtenerEstadisticas: () => HistorialEstadisticas
  buscarEnHistorial: (termino: string) => HistorialHabitacion[]

  // Funciones de localStorage
  exportarDatos: () => string
  importarDatos: (datos: string) => boolean
  limpiarDatos: () => void
}

interface HistorialEstadisticas {
  totalMovimientos: number
  movimientosPorTipo: Record<TipoMovimiento, number>
  habitacionesActivas: number
  ultimosMovimientos: HistorialHabitacion[]
  movimientosHoy: number
}

const HistorialContext = createContext<HistorialContextType | undefined>(undefined)

// Clave para localStorage
const HISTORIAL_STORAGE_KEY = 'historial_habitaciones_data'

// Funciones de localStorage
const guardarEnStorage = (historial: HistorialHabitacion[]) => {
  try {
    localStorage.setItem(HISTORIAL_STORAGE_KEY, JSON.stringify(historial))
  } catch (error) {
    console.error('Error al guardar historial en localStorage:', error)
  }
}

const cargarDesdeStorage = (): HistorialHabitacion[] => {
  try {
    const data = localStorage.getItem(HISTORIAL_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error al cargar historial desde localStorage:', error)
    return []
  }
}

// Datos iniciales para el historial (si no hay datos en localStorage)
const historialInicial: HistorialHabitacion[] = [
  {
    id: 1,
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
  },
  {
    id: 2,
    habitacionId: 102,
    habitacionNombre: 'Habitación 102',
    tipoMovimiento: 'cambio_estado',
    estadoAnterior: 'ocupada',
    estadoNuevo: 'en-limpieza',
    fecha: '2024-01-15',
    hora: '11:00',
    observaciones: 'Requiere limpieza profunda',
    usuario: 'Ama de llaves'
  },
  {
    id: 3,
    habitacionId: 101,
    habitacionNombre: 'Habitación 101',
    tipoMovimiento: 'check_out',
    estadoAnterior: 'ocupada',
    estadoNuevo: 'en-limpieza',
    huespedNombre: 'Juan Pérez',
    huespedDocumento: '12345678',
    fecha: '2024-01-16',
    hora: '12:00',
    observaciones: 'Check-out normal',
    usuario: 'Recepcionista 2'
  }
]

interface HistorialProviderProps {
  children: ReactNode
}

export const HistorialProvider = ({ children }: HistorialProviderProps) => {
  const [historial, setHistorial] = useState<HistorialHabitacion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargar historial al inicializar
  useEffect(() => {
    const historialGuardado = cargarDesdeStorage()
    if (historialGuardado.length > 0) {
      setHistorial(historialGuardado)
    } else {
      // Si no hay datos guardados, usar datos iniciales
      setHistorial(historialInicial)
      guardarEnStorage(historialInicial)
    }
    setIsLoading(false)
  }, [])

  // Guardar historial cuando cambie
  useEffect(() => {
    if (!isLoading && historial.length > 0) {
      guardarEnStorage(historial)
    }
  }, [historial, isLoading])

  // Funciones CRUD
  const agregarMovimiento = (nuevoMovimiento: Omit<HistorialHabitacion, 'id'>) => {
    const maxId = historial.reduce((max, mov) => Math.max(max, mov.id), 0)
    const movimiento: HistorialHabitacion = {
      ...nuevoMovimiento,
      id: maxId + 1
    }

    setHistorial(prev => [...prev, movimiento])
  }

  const actualizarMovimiento = (id: number, movimientoActualizado: Partial<HistorialHabitacion>) => {
    setHistorial(prev => prev.map(movimiento =>
      movimiento.id === id
        ? { ...movimiento, ...movimientoActualizado }
        : movimiento
    ))
  }

  const eliminarMovimiento = (id: number) => {
    setHistorial(prev => prev.filter(movimiento => movimiento.id !== id))
  }

  const obtenerMovimientoPorId = (id: number): HistorialHabitacion | undefined => {
    return historial.find(movimiento => movimiento.id === id)
  }

  // Funciones de utilidad
  const obtenerHistorialPorHabitacion = (habitacionId: number): HistorialHabitacion[] => {
    return historial
      .filter(movimiento => movimiento.habitacionId === habitacionId)
      .sort((a, b) => new Date(b.fecha + ' ' + b.hora).getTime() - new Date(a.fecha + ' ' + a.hora).getTime())
  }

  const obtenerHistorialPorTipo = (tipo: TipoMovimiento): HistorialHabitacion[] => {
    return historial.filter(movimiento => movimiento.tipoMovimiento === tipo)
  }

  const obtenerHistorialPorFecha = (fecha: string): HistorialHabitacion[] => {
    return historial.filter(movimiento => movimiento.fecha === fecha)
  }

  const obtenerEstadisticas = (): HistorialEstadisticas => {
    const today = new Date().toISOString().split('T')[0]

    const movimientosPorTipo = historial.reduce((acc, movimiento) => {
      acc[movimiento.tipoMovimiento] = (acc[movimiento.tipoMovimiento] || 0) + 1
      return acc
    }, {} as Record<TipoMovimiento, number>)

    const habitacionesActivas = new Set(
      historial
        .filter(mov => mov.estadoNuevo === 'ocupada')
        .map(mov => mov.habitacionId)
    ).size

    const ultimosMovimientos = historial
      .sort((a, b) => new Date(b.fecha + ' ' + b.hora).getTime() - new Date(a.fecha + ' ' + a.hora).getTime())
      .slice(0, 10)

    const movimientosHoy = historial.filter(mov => mov.fecha === today).length

    return {
      totalMovimientos: historial.length,
      movimientosPorTipo,
      habitacionesActivas,
      ultimosMovimientos,
      movimientosHoy
    }
  }

  const buscarEnHistorial = (termino: string): HistorialHabitacion[] => {
    const terminoLower = termino.toLowerCase()
    return historial.filter(movimiento =>
      movimiento.habitacionNombre.toLowerCase().includes(terminoLower) ||
      movimiento.huespedNombre?.toLowerCase().includes(terminoLower) ||
      movimiento.huespedDocumento?.toLowerCase().includes(terminoLower) ||
      movimiento.observaciones?.toLowerCase().includes(terminoLower) ||
      movimiento.usuario?.toLowerCase().includes(terminoLower)
    )
  }

  // Funciones de localStorage
  const exportarDatos = (): string => {
    return JSON.stringify(historial, null, 2)
  }

  const importarDatos = (datos: string): boolean => {
    try {
      const historialImportado = JSON.parse(datos) as HistorialHabitacion[]

      // Validar que sean movimientos válidos
      const movimientosValidos = historialImportado.filter(movimiento =>
        movimiento.id && movimiento.habitacionId && movimiento.fecha
      )

      if (movimientosValidos.length > 0) {
        setHistorial(movimientosValidos)
        return true
      }

      return false
    } catch (error) {
      console.error('Error al importar historial:', error)
      return false
    }
  }

  const limpiarDatos = () => {
    setHistorial([])
    localStorage.removeItem(HISTORIAL_STORAGE_KEY)
  }

  const value: HistorialContextType = {
    historial,
    isLoading,
    agregarMovimiento,
    actualizarMovimiento,
    eliminarMovimiento,
    obtenerMovimientoPorId,
    obtenerHistorialPorHabitacion,
    obtenerHistorialPorTipo,
    obtenerHistorialPorFecha,
    obtenerEstadisticas,
    buscarEnHistorial,
    exportarDatos,
    importarDatos,
    limpiarDatos
  }

  return (
    <HistorialContext.Provider value={value}>
      {children}
    </HistorialContext.Provider>
  )
}

// Hook para usar el contexto
export const useHistorial = () => {
  const context = useContext(HistorialContext)
  if (context === undefined) {
    throw new Error('useHistorial debe ser usado dentro de un HistorialProvider')
  }
  return context
}

// Hooks específicos para diferentes operaciones
export const useHistorialEstadisticas = () => {
  const { obtenerEstadisticas } = useHistorial()
  return obtenerEstadisticas()
}

export const useHistorialPorHabitacion = (habitacionId: number) => {
  const { obtenerHistorialPorHabitacion } = useHistorial()
  return obtenerHistorialPorHabitacion(habitacionId)
}

export const useHistorialPorTipo = (tipo: TipoMovimiento) => {
  const { obtenerHistorialPorTipo } = useHistorial()
  return obtenerHistorialPorTipo(tipo)
}

export const useBuscarHistorial = (termino: string) => {
  const { buscarEnHistorial } = useHistorial()
  return buscarEnHistorial(termino)
}
