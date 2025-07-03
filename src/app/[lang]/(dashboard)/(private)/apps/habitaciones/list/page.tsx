// Component Imports
import RoomList from '@/views/apps/habitaciones/list'

// Helper function to get dates for testing
const getToday = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

const getTomorrowDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

const getNextHour = () => {
  const nextHour = new Date()
  nextHour.setHours(nextHour.getHours() + 2) // 2 hours from now (within 3-hour window)
  return nextHour.toTimeString().slice(0, 5)
}

const getFutureTime = () => {
  const futureTime = new Date()
  futureTime.setHours(futureTime.getHours() + 5) // 5 hours from now (outside 3-hour window)
  return futureTime.toTimeString().slice(0, 5)
}

// Data de ejemplo para habitaciones
const roomData = [
  {
    id: 1,
    name: 'Habitación 101',
    estado: 'ocupada' as const,
    huespedNombre: 'Juan Carlos Pérez',
    huespedDocumento: '75675863',
    fechaCheckIn: getToday(),
    horaCheckIn: '14:30'
  },
  { id: 2, name: 'Habitación 102', estado: 'vacia' as const },
  { id: 3, name: 'Habitación 103', estado: 'en-limpieza' as const },
  {
    id: 4,
    name: 'Habitación 201',
    estado: 'ocupada' as const,
    huespedNombre: 'María Fernanda López',
    huespedDocumento: '75675863',
    fechaCheckIn: getToday(),
    horaCheckIn: '16:15'
  },
  {
    id: 5,
    name: 'Habitación 202',
    estado: 'reservada' as const,
    fechaReserva: getToday(),
    horaReserva: getNextHour()
  }, // Reserva próxima - BLOQUEADA
  { id: 6, name: 'Suite Premium', estado: 'en-limpieza' as const },
  { id: 7, name: 'Habitación 301', estado: 'vacia' as const },
  {
    id: 8,
    name: 'Habitación 302',
    estado: 'reservada' as const,
    fechaReserva: getToday(),
    horaReserva: getFutureTime()
  }, // Reserva lejana - NO BLOQUEADA (puede hacer check-in)
  {
    id: 9,
    name: 'Suite Ejecutiva',
    estado: 'reservada' as const,
    fechaReserva: getTomorrowDate(),
    horaReserva: '12:00'
  } // Reserva mañana - NO BLOQUEADA (puede hacer check-in)
]

const RoomListPage = () => {
  return <RoomList roomData={roomData} />
}

export default RoomListPage
