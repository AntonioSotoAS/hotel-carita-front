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
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Context Imports
import { type Habitacion, type CheckInData } from '@/contexts/HabitacionesContext'
import { useClientes } from '@/contexts/ClientesContext'

type Props = {
  open: boolean
  handleClose: () => void
  room: Habitacion | null
  onCheckIn: (roomId: number, checkInData: CheckInData) => void
}



const CheckInModal = ({ open, handleClose, room, onCheckIn }: Props) => {
  // Get current date and time
  const now = new Date()
  const currentDate = now.toISOString().split('T')[0]
  const currentTime = now.toTimeString().split(' ')[0].substring(0, 5)

  // Context
  const { clientes } = useClientes()

  // States
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null)

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CheckInData>({
    defaultValues: {
      huespedNombre: '',
      huespedDocumento: '',
      fechaCheckIn: currentDate,
      horaCheckIn: currentTime
    }
  })

  const huespedNombre = watch('huespedNombre')

      // Prepare client options for autocomplete
  const clienteOptions = clientes.map(cliente => ({
    id: cliente.id,
    label: cliente.tipo_documento === 'DNI'
      ? cliente.nombre_completo || `${cliente.nombres || ''} ${cliente.apellido_paterno || ''} ${cliente.apellido_materno || ''}`.trim()
      : cliente.nombre_o_razon_social || cliente.numero_documento,
    documento: cliente.numero_documento,
    nombre: cliente.tipo_documento === 'DNI'
      ? cliente.nombre_completo || `${cliente.nombres || ''} ${cliente.apellido_paterno || ''} ${cliente.apellido_materno || ''}`.trim()
      : cliente.nombre_o_razon_social || cliente.numero_documento,
    tipo: cliente.tipo_documento
  }))

  // Handle client selection
  const handleClienteSelection = (cliente: any) => {
    if (cliente) {
      setClienteSeleccionado(cliente)
      setValue('huespedNombre', cliente.nombre)
      setValue('huespedDocumento', cliente.documento)
    } else {
      setClienteSeleccionado(null)
    }
  }

  const onSubmit = (data: CheckInData) => {
    if (room) {
      onCheckIn(room.id, data)
      handleClose()
      reset()
      setClienteSeleccionado(null)
    }
  }

  const handleModalClose = () => {
    handleClose()
    reset()
    setClienteSeleccionado(null)
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

            {clienteOptions.length > 0 && (
              <div className='bg-info-50 p-3 rounded'>
                <Typography variant='body2' color='info.main' className='flex items-center gap-1'>
                  <i className='tabler-users' />
                  <strong>{clienteOptions.length} clientes</strong> disponibles en el registro
                </Typography>
              </div>
            )}

            <Controller
              name='huespedNombre'
              control={control}
              rules={{
                required: 'El huésped es requerido'
              }}
              render={({ field }) => (
                <Autocomplete
                  options={clienteOptions}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                  freeSolo
                  value={field.value}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      field.onChange(newValue)
                    } else if (newValue && newValue.label) {
                      handleClienteSelection(newValue)
                    } else {
                      field.onChange('')
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    field.onChange(newInputValue)
                  }}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      fullWidth
                      label='Seleccionar Cliente'
                      placeholder='Buscar cliente existente o escribir nuevo...'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <div className='flex items-center gap-1'>
                            {clienteSeleccionado && (
                              <IconButton
                                size='small'
                                onClick={() => {
                                  setClienteSeleccionado(null)
                                  setValue('huespedNombre', '')
                                  setValue('huespedDocumento', '')
                                }}
                                title='Limpiar selección'
                              >
                                <i className='tabler-x' />
                              </IconButton>
                            )}
                            {params.InputProps.endAdornment}
                          </div>
                        )
                      }}
                      {...(errors.huespedNombre && { error: true, helperText: errors.huespedNombre.message })}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      <div className='flex flex-col'>
                        <Typography variant='body2' className='font-medium'>
                          {option.nombre}
                        </Typography>
                        <div className='flex items-center gap-2'>
                          <Chip
                            label={option.tipo}
                            size='small'
                            color={option.tipo === 'DNI' ? 'primary' : 'secondary'}
                            variant='outlined'
                          />
                          <Typography variant='caption' color='textSecondary'>
                            {option.documento}
                          </Typography>
                        </div>
                      </div>
                    </li>
                  )}
                  noOptionsText='No se encontraron clientes'
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
                <div className='flex flex-col gap-2'>
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Documento de Identidad'
                    placeholder='Cédula, Pasaporte, etc.'
                    InputProps={{
                      readOnly: Boolean(clienteSeleccionado),
                      endAdornment: clienteSeleccionado && (
                        <Chip
                          label={clienteSeleccionado.tipo}
                          size='small'
                          color={clienteSeleccionado.tipo === 'DNI' ? 'primary' : 'secondary'}
                          variant='outlined'
                        />
                      )
                    }}
                    {...(errors.huespedDocumento && { error: true, helperText: errors.huespedDocumento.message })}
                  />
                  {clienteSeleccionado && (
                    <Typography variant='caption' color='success.main' className='flex items-center gap-1'>
                      <i className='tabler-check' />
                      Cliente seleccionado del registro
                    </Typography>
                  )}
                </div>
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
