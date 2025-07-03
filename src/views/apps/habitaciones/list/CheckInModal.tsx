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

// Types
type RoomType = {
  id: number
  name: string
  estado: 'ocupada' | 'vacia' | 'en-limpieza' | 'reservada'
  fechaReserva?: string
  horaReserva?: string
  fechaCheckIn?: string
  horaCheckIn?: string
  fechaCheckOut?: string
  horaCheckOut?: string
  huespedNombre?: string
  huespedDocumento?: string
}

type Props = {
  open: boolean
  handleClose: () => void
  room: RoomType | null
  onCheckIn: (roomId: number, checkInData: CheckInData) => void
}

type CheckInData = {
  huespedNombre: string
  huespedDocumento: string
  fechaCheckIn: string
  horaCheckIn: string
}

const CheckInModal = ({ open, handleClose, room, onCheckIn }: Props) => {
  // Get current date and time
  const now = new Date()
  const currentDate = now.toISOString().split('T')[0]
  const currentTime = now.toTimeString().split(' ')[0].substring(0, 5)

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckInData>({
    defaultValues: {
      huespedNombre: '',
      huespedDocumento: '',
      fechaCheckIn: currentDate,
      horaCheckIn: currentTime
    }
  })

  const onSubmit = (data: CheckInData) => {
    if (room) {
      onCheckIn(room.id, data)
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
          <Typography variant='h5'>Check-In - {room.name}</Typography>
          <IconButton onClick={handleModalClose} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </div>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <div className='flex flex-col gap-4'>
            {room.fechaReserva && (
              <div className='bg-primary-50 p-3 rounded'>
                <Typography variant='body2' color='primary'>
                  <strong>Reserva:</strong> {room.fechaReserva} a las {room.horaReserva}
                </Typography>
              </div>
            )}

            <Controller
              name='huespedNombre'
              control={control}
              rules={{
                required: 'El nombre del huésped es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres'
                }
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Nombre del Huésped'
                  placeholder='Ingrese el nombre completo'
                  {...(errors.huespedNombre && { error: true, helperText: errors.huespedNombre.message })}
                />
              )}
            />

            <Controller
              name='huespedDocumento'
              control={control}
              rules={{
                required: 'El documento es requerido',
                minLength: {
                  value: 5,
                  message: 'El documento debe tener al menos 5 caracteres'
                }
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Documento de Identidad'
                  placeholder='Cédula, Pasaporte, etc.'
                  {...(errors.huespedDocumento && { error: true, helperText: errors.huespedDocumento.message })}
                />
              )}
            />

            <div className='flex gap-4'>
              <Controller
                name='fechaCheckIn'
                control={control}
                rules={{
                  required: 'La fecha de check-in es requerida'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Fecha de Check-In'
                    type='date'
                    InputLabelProps={{ shrink: true }}
                    {...(errors.fechaCheckIn && { error: true, helperText: errors.fechaCheckIn.message })}
                  />
                )}
              />

              <Controller
                name='horaCheckIn'
                control={control}
                rules={{
                  required: 'La hora de check-in es requerida'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Hora de Check-In'
                    type='time'
                    InputLabelProps={{ shrink: true }}
                    {...(errors.horaCheckIn && { error: true, helperText: errors.horaCheckIn.message })}
                  />
                )}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleModalClose} color='secondary'>
            Cancelar
          </Button>
          <Button type='submit' variant='contained' color='primary'>
            Realizar Check-In
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CheckInModal
