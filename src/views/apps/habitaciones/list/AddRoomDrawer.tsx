// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'

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
  roomData?: RoomType[]
  setData: (data: RoomType[]) => void
}

type FormValidateType = {
  name: string
  estado: 'ocupada' | 'vacia' | 'en-limpieza' | 'reservada'
  fechaReserva?: string
  horaReserva?: string
}

const AddRoomDrawer = (props: Props) => {
  // Props
  const { open, handleClose, roomData, setData } = props

  // States
  const [selectedEstado, setSelectedEstado] = useState<FormValidateType['estado']>('vacia')

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues: {
      name: '',
      estado: 'vacia'
    }
  })

  // Watch estado field to show/hide date and time fields
  const watchedEstado = watch('estado')

  useEffect(() => {
    setSelectedEstado(watchedEstado)
  }, [watchedEstado])

  const onSubmit = (data: FormValidateType) => {
    const newRoom: RoomType = {
      id: (roomData?.length ? Math.max(...roomData.map(r => r.id)) + 1 : 1),
      name: data.name,
      estado: data.estado,
      ...(data.estado === 'reservada' && {
        fechaReserva: data.fechaReserva,
        horaReserva: data.horaReserva
      })
    }

    setData([...(roomData ?? []), newRoom])
    handleClose()
    resetForm({ name: '', estado: 'vacia', fechaReserva: undefined, horaReserva: undefined })
  }

  const handleReset = () => {
    handleClose()
    resetForm({ name: '', estado: 'vacia', fechaReserva: undefined, horaReserva: undefined })
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Agregar Nueva Habitación</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6 p-6'>
          <Controller
            name='name'
            control={control}
            rules={{
              required: 'Este campo es requerido',
              minLength: {
                value: 2,
                message: 'El nombre debe tener al menos 2 caracteres'
              }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Nombre de la Habitación'
                placeholder='Ej: Habitación 101'
                {...(errors.name && { error: true, helperText: errors.name.message })}
              />
            )}
          />
          <Controller
            name='estado'
            control={control}
            rules={{
              required: 'Este campo es requerido'
            }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                id='select-estado'
                label='Estado de la Habitación'
                {...field}
                {...(errors.estado && { error: true, helperText: errors.estado.message })}
              >
                <MenuItem value='vacia'>Vacía</MenuItem>
                <MenuItem value='ocupada'>Ocupada</MenuItem>
                <MenuItem value='en-limpieza'>En Limpieza</MenuItem>
                <MenuItem value='reservada'>Reservada</MenuItem>
              </CustomTextField>
            )}
          />
                      {watchedEstado === 'reservada' && (
              <>
                <Controller
                  name='fechaReserva'
                  control={control}
                  rules={{
                    required: watchedEstado === 'reservada' ? 'La fecha de reserva es requerida' : false
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      label='Fecha de Reserva'
                      type='date'
                      InputLabelProps={{ shrink: true }}
                      {...field}
                      {...(errors.fechaReserva && { error: true, helperText: errors.fechaReserva.message })}
                    />
                  )}
                />
                <Controller
                  name='horaReserva'
                  control={control}
                  rules={{
                    required: watchedEstado === 'reservada' ? 'La hora de reserva es requerida' : false
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      label='Hora de Reserva'
                      type='time'
                      InputLabelProps={{ shrink: true }}
                      {...field}
                      {...(errors.horaReserva && { error: true, helperText: errors.horaReserva.message })}
                    />
                  )}
                />
              </>
            )}
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Agregar Habitación
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddRoomDrawer
