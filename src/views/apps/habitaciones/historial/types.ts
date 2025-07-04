// Types para el historial de habitaciones
export type TipoMovimiento = 'cambio_estado' | 'check_in' | 'check_out' | 'reserva' | 'cancelacion'

export interface HistorialHabitacion {
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

export interface FiltrosHistorial {
  habitacion?: string
  tipoMovimiento?: TipoMovimiento
  fechaDesde?: string
  fechaHasta?: string
  huesped?: string
}
