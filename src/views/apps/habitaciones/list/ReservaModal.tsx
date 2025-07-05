// React Imports
import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Context Imports
import { type Habitacion, type ReservaData } from '@/contexts/HabitacionesContext'

type Props = {
  open: boolean
  handleClose: () => void
  room: Habitacion | null
  onReserva: (roomId: number, reservaData: ReservaData) => void
}

const ReservaModal = ({ open, handleClose, room, onReserva }: Props) => {
  // Get tomorrow's date as default (reservations are usually for future dates)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDate = tomorrow.toISOString().split('T')[0]

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<ReservaData>({
    defaultValues: {
      fechaReserva: tomorrowDate,
      horaReserva: '14:00' // Standard check-in time
    }
  })

  const onSubmit = (data: ReservaData) => {
    if (room) {
      onReserva(room.id, data)
      handleClose()
      reset()
    }
  }

  const handleModalClose = () => {
    handleClose()
    reset()
  }

  if (!room) return null

  return (
    <Dialog open={open} onClose={handleModalClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <div className='flex items-center justify-between'>
          <Typography variant='h5'>Crear Reserva - {room.name}</Typography>
          <IconButton onClick={handleModalClose} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </div>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <div className='flex flex-col gap-4'>
            <div className='bg-info-50 p-3 rounded'>
              <Typography variant='body2' color='info.main'>
                <strong>Habitación:</strong> {room.name}
              </Typography>
              <Typography variant='body2' color='info.main'>
                <strong>Estado actual:</strong> {room.estado === 'vacia' ? 'Vacía' :
                                                 room.estado === 'ocupada' ? 'Ocupada' :
                                                 room.estado === 'en-limpieza' ? 'En Limpieza' : 'Reservada'}
              </Typography>
            </div>

            <Typography variant='body1' className='font-medium'>
              Datos de la Reserva:
            </Typography>

            <Controller
              name='fechaReserva'
              control={control}
              rules={{
                required: 'La fecha de reserva es requerida',
                validate: (value) => {
                  const selectedDate = new Date(value)
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)

                  if (selectedDate < today) {
                    return 'La fecha de reserva no puede ser anterior a hoy'
                  }
                  return true
                }
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Fecha de Reserva'
                  type='date'
                  InputLabelProps={{ shrink: true }}
                  {...(errors.fechaReserva && { error: true, helperText: errors.fechaReserva.message })}
                />
              )}
            />

            <Controller
              name='horaReserva'
              control={control}
              rules={{
                required: 'La hora de reserva es requerida'
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Hora de Reserva (Check-in esperado)'
                  type='time'
                  InputLabelProps={{ shrink: true }}
                  {...(errors.horaReserva && { error: true, helperText: errors.horaReserva.message })}
                />
              )}
            />

            <Typography variant='body2' color='textSecondary'>
              💡 La habitación pasará a estado "Reservada" y se podrá hacer check-in cuando llegue el momento.
            </Typography>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleModalClose} color='secondary'>
            Cancelar
          </Button>
          <Button type='submit' variant='contained' color='info'>
            Crear Reserva
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ReservaModal
