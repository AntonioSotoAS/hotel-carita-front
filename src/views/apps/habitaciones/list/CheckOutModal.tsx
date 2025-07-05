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
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Context Imports
import { type Habitacion, type CheckOutData } from '@/contexts/HabitacionesContext'

type Props = {
  open: boolean
  handleClose: () => void
  room: Habitacion | null
  onCheckOut: (roomId: number, checkOutData: CheckOutData) => void
}

const CheckOutModal = ({ open, handleClose, room, onCheckOut }: Props) => {
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
  } = useForm<CheckOutData>({
    defaultValues: {
      fechaCheckOut: currentDate,
      horaCheckOut: currentTime,
      requiereLimpieza: true
    }
  })

  const onSubmit = (data: CheckOutData) => {
    if (room) {
      onCheckOut(room.id, data)
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
          <Typography variant='h5'>Check-Out - {room.name}</Typography>
          <IconButton onClick={handleModalClose} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </div>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <div className='flex flex-col gap-4'>
            {/* Información del huésped actual */}
            <div className='bg-info-50 p-3 rounded'>
              <Typography variant='body2' color='info.main'>
                <strong>Huésped:</strong> {room.huespedNombre}
              </Typography>
              <Typography variant='body2' color='info.main'>
                <strong>Documento:</strong> {room.huespedDocumento}
              </Typography>
              {room.fechaCheckIn && (
                <Typography variant='body2' color='info.main'>
                  <strong>Check-In:</strong> {room.fechaCheckIn} a las {room.horaCheckIn}
                </Typography>
              )}
            </div>

            <div className='flex gap-4'>
              <Controller
                name='fechaCheckOut'
                control={control}
                rules={{
                  required: 'La fecha de check-out es requerida'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Fecha de Check-Out'
                    type='date'
                    InputLabelProps={{ shrink: true }}
                    {...(errors.fechaCheckOut && { error: true, helperText: errors.fechaCheckOut.message })}
                  />
                )}
              />

              <Controller
                name='horaCheckOut'
                control={control}
                rules={{
                  required: 'La hora de check-out es requerida'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Hora de Check-Out'
                    type='time'
                    InputLabelProps={{ shrink: true }}
                    {...(errors.horaCheckOut && { error: true, helperText: errors.horaCheckOut.message })}
                  />
                )}
              />
            </div>

            <Controller
              name='requiereLimpieza'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      color='primary'
                    />
                  }
                  label='La habitación requiere limpieza'
                />
              )}
            />

            <Typography variant='body2' color='textSecondary'>
              Si marca "requiere limpieza", el estado cambiará a "En Limpieza".
              Si no, la habitación quedará disponible (Vacía).
            </Typography>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleModalClose} color='secondary'>
            Cancelar
          </Button>
          <Button type='submit' variant='contained' color='error'>
            Realizar Check-Out
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CheckOutModal
