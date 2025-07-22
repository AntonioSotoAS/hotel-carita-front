// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Contexts
import { useClientes } from '@/contexts/ClientesContext'

// Types
import type { Cliente } from '@/contexts/ClientesContext'

type Props = {
  open: boolean
  handleClose: () => void
  cliente: Cliente | null
}

type FormValidateType = {
  tipo_documento: 'DNI' | 'RUC'
  numero_documento: string
  nombres?: string
  apellido_paterno?: string
  apellido_materno?: string
  nombre_completo?: string
  codigo_verificacion?: string
  nombre_o_razon_social?: string
  estado?: string
  condicion?: string
  direccion?: string
  direccion_completa?: string
  departamento?: string
  provincia?: string
  distrito?: string
  ubigeo_sunat?: string
  ubigeo_reniec?: string
  ciiu?: string
  tipo_contribuyente?: string
  es_agente_de_retencion?: string
  es_buen_contribuyente?: string
  email?: string
  telefono?: string
  observaciones?: string
}

const EditClienteDrawer = (props: Props) => {
  // Props
  const { open, handleClose, cliente } = props

  // Context
  const { actualizarCliente } = useClientes()

  // States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormValidateType>({
    defaultValues: {
      tipo_documento: 'DNI',
      numero_documento: '',
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      nombre_completo: '',
      codigo_verificacion: '',
      nombre_o_razon_social: '',
      estado: '',
      condicion: '',
      direccion: '',
      direccion_completa: '',
      departamento: '',
      provincia: '',
      distrito: '',
      ubigeo_sunat: '',
      ubigeo_reniec: '',
      ciiu: '',
      tipo_contribuyente: '',
      es_agente_de_retencion: '',
      es_buen_contribuyente: '',
      email: '',
      telefono: '',
      observaciones: ''
    }
  })

  const tipoDocumento = watch('tipo_documento')

  // Cargar datos del cliente cuando se abre el drawer
  useEffect(() => {
    if (cliente && open) {
      setValue('tipo_documento', cliente.tipo_documento)
      setValue('numero_documento', cliente.numero_documento)
      setValue('nombres', cliente.nombres || '')
      setValue('apellido_paterno', cliente.apellido_paterno || '')
      setValue('apellido_materno', cliente.apellido_materno || '')
      setValue('nombre_completo', cliente.nombre_completo || '')
      setValue('codigo_verificacion', cliente.codigo_verificacion || '')
      setValue('nombre_o_razon_social', cliente.nombre_o_razon_social || '')
      setValue('estado', cliente.estado || '')
      setValue('condicion', cliente.condicion || '')
      setValue('direccion', cliente.direccion || '')
      setValue('direccion_completa', cliente.direccion_completa || '')
      setValue('departamento', cliente.departamento || '')
      setValue('provincia', cliente.provincia || '')
      setValue('distrito', cliente.distrito || '')
      setValue('ubigeo_sunat', cliente.ubigeo_sunat || '')
      setValue('ubigeo_reniec', cliente.ubigeo_reniec || '')
      setValue('ciiu', cliente.ciiu || '')
      setValue('tipo_contribuyente', cliente.tipo_contribuyente || '')
      setValue('es_agente_de_retencion', cliente.es_agente_de_retencion || '')
      setValue('es_buen_contribuyente', cliente.es_buen_contribuyente || '')
      setValue('email', cliente.email || '')
      setValue('telefono', cliente.telefono || '')
      setValue('observaciones', cliente.observaciones || '')
    }
  }, [cliente, open, setValue])

  const onSubmit = async (data: FormValidateType) => {
    if (!cliente) return

    setIsSubmitting(true)

    try {
      // Actualizar cliente con datos del formulario
      const clienteActualizado: Partial<Cliente> = {
        tipo_documento: data.tipo_documento,
        numero_documento: data.numero_documento,
        nombres: data.nombres,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        nombre_completo: data.nombre_completo,
        codigo_verificacion: data.codigo_verificacion,
        nombre_o_razon_social: data.nombre_o_razon_social,
        estado: data.estado,
        condicion: data.condicion,
        direccion: data.direccion,
        direccion_completa: data.direccion_completa,
        departamento: data.departamento,
        provincia: data.provincia,
        distrito: data.distrito,
        ubigeo_sunat: data.ubigeo_sunat,
        ubigeo_reniec: data.ubigeo_reniec,
        ciiu: data.ciiu,
        tipo_contribuyente: data.tipo_contribuyente,
        es_agente_de_retencion: data.es_agente_de_retencion,
        es_buen_contribuyente: data.es_buen_contribuyente,
        email: data.email,
        telefono: data.telefono,
        observaciones: data.observaciones,
        fechaActualizacion: new Date().toISOString()
      }

      // Usar el contexto para actualizar el cliente
      actualizarCliente(cliente.id, clienteActualizado)

      // Cerrar drawer y resetear form
      handleClose()
      resetForm()
    } catch (error) {
      console.error('Error al actualizar cliente:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    handleClose()
    resetForm()
    setActiveTab(0)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  if (!cliente) return null

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 350, sm: 500 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Editar Cliente</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />

      {/* Información del cliente */}
      <div className='p-6 bg-gray-50'>
        <Typography variant='subtitle2' color='text.secondary' gutterBottom>
          ID: {cliente.id}
        </Typography>
        <Typography variant='subtitle2' color='text.secondary' gutterBottom>
          Tipo: {cliente.tipo_documento}
        </Typography>
        <Typography variant='subtitle2' color='text.secondary' gutterBottom>
          Documento: {cliente.numero_documento}
        </Typography>
        {cliente.fechaCreacion && (
          <Typography variant='subtitle2' color='text.secondary'>
            Creado: {new Date(cliente.fechaCreacion).toLocaleDateString()}
          </Typography>
        )}
      </div>

      <div>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6 p-6'>
          {/* Tabs para organizar la información */}
          <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
            <Tab label="General" />
            <Tab label={tipoDocumento === 'DNI' ? 'Personal' : 'Empresa'} />
            <Tab label="Contacto" />
          </Tabs>

          {/* Tab General */}
          {activeTab === 0 && (
            <div className='space-y-4'>
              <Controller
                name='tipo_documento'
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Documento *</InputLabel>
                    <Select
                      {...field}
                      label='Tipo de Documento *'
                    >
                      <MenuItem value='DNI'>DNI</MenuItem>
                      <MenuItem value='RUC'>RUC</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name='numero_documento'
                control={control}
                rules={{
                  required: 'Este campo es requerido',
                  minLength: {
                    value: tipoDocumento === 'DNI' ? 8 : 11,
                    message: tipoDocumento === 'DNI' ? 'El DNI debe tener 8 dígitos' : 'El RUC debe tener 11 dígitos'
                  },
                  maxLength: {
                    value: tipoDocumento === 'DNI' ? 8 : 11,
                    message: tipoDocumento === 'DNI' ? 'El DNI debe tener 8 dígitos' : 'El RUC debe tener 11 dígitos'
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={`Número de ${tipoDocumento} *`}
                    placeholder={tipoDocumento === 'DNI' ? '12345678' : '20123456789'}
                    {...(errors.numero_documento && { error: true, helperText: errors.numero_documento.message })}
                  />
                )}
              />

              <Controller
                name='observaciones'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label='Observaciones'
                    placeholder='Observaciones adicionales'
                  />
                )}
              />
            </div>
          )}

          {/* Tab Personal/Empresa */}
          {activeTab === 1 && (
            <div className='space-y-4'>
              {tipoDocumento === 'DNI' ? (
                // Campos para DNI
                <>
                  <Controller
                    name='nombres'
                    control={control}
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Nombres *'
                        placeholder='Juan Carlos'
                        {...(errors.nombres && { error: true, helperText: errors.nombres.message })}
                      />
                    )}
                  />

                  <div className='flex gap-4'>
                    <Controller
                      name='apellido_paterno'
                      control={control}
                      rules={{ required: 'Este campo es requerido' }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          label='Apellido Paterno *'
                          placeholder='Pérez'
                          {...(errors.apellido_paterno && { error: true, helperText: errors.apellido_paterno.message })}
                        />
                      )}
                    />

                    <Controller
                      name='apellido_materno'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          label='Apellido Materno'
                          placeholder='García'
                        />
                      )}
                    />
                  </div>

                  <Controller
                    name='codigo_verificacion'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Código de Verificación'
                        placeholder='1'
                        inputProps={{ maxLength: 1 }}
                      />
                    )}
                  />
                </>
              ) : (
                // Campos para RUC
                <>
                  <Controller
                    name='nombre_o_razon_social'
                    control={control}
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Nombre o Razón Social *'
                        placeholder='EMPRESA DEMO S.A.C.'
                        {...(errors.nombre_o_razon_social && { error: true, helperText: errors.nombre_o_razon_social.message })}
                      />
                    )}
                  />

                  <div className='flex gap-4'>
                    <Controller
                      name='estado'
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Estado</InputLabel>
                          <Select {...field} label='Estado'>
                            <MenuItem value='ACTIVO'>ACTIVO</MenuItem>
                            <MenuItem value='INACTIVO'>INACTIVO</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />

                    <Controller
                      name='condicion'
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Condición</InputLabel>
                          <Select {...field} label='Condición'>
                            <MenuItem value='HABIDO'>HABIDO</MenuItem>
                            <MenuItem value='NO HABIDO'>NO HABIDO</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>

                  <Controller
                    name='direccion'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Dirección'
                        placeholder='JR. ANDAHUAYLAS NRO. 100 INT. 201'
                      />
                    )}
                  />

                  <div className='flex gap-4'>
                    <Controller
                      name='departamento'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          label='Departamento'
                          placeholder='LIMA'
                        />
                      )}
                    />

                    <Controller
                      name='provincia'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          label='Provincia'
                          placeholder='LIMA'
                        />
                      )}
                    />
                  </div>

                  <Controller
                    name='distrito'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Distrito'
                        placeholder='MAGDALENA DEL MAR'
                      />
                    )}
                  />

                  <div className='flex gap-4'>
                    <Controller
                      name='ubigeo_sunat'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          label='Ubigeo SUNAT'
                          placeholder='150101'
                          inputProps={{ maxLength: 6 }}
                        />
                      )}
                    />

                    <Controller
                      name='ubigeo_reniec'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          label='Ubigeo RENIEC'
                          placeholder='150101'
                          inputProps={{ maxLength: 6 }}
                        />
                      )}
                    />
                  </div>

                  <div className='flex gap-4'>
                    <Controller
                      name='es_agente_de_retencion'
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Agente de Retención</InputLabel>
                          <Select {...field} label='Agente de Retención'>
                            <MenuItem value='SI'>SI</MenuItem>
                            <MenuItem value='NO'>NO</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />

                    <Controller
                      name='es_buen_contribuyente'
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Buen Contribuyente</InputLabel>
                          <Select {...field} label='Buen Contribuyente'>
                            <MenuItem value='SI'>SI</MenuItem>
                            <MenuItem value='NO'>NO</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tab Contacto */}
          {activeTab === 2 && (
            <div className='space-y-4'>
              <Controller
                name='email'
                control={control}
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='email'
                    label='Email'
                    placeholder='cliente@ejemplo.com'
                    {...(errors.email && { error: true, helperText: errors.email.message })}
                  />
                )}
              />

              <Controller
                name='telefono'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Teléfono'
                    placeholder='+51 999 999 999'
                  />
                )}
              />
            </div>
          )}

          <div className='flex items-center gap-4'>
            <Button
              variant='contained'
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Actualizar Cliente'}
            </Button>
            <Button
              variant='tonal'
              color='error'
              type='reset'
              onClick={() => handleReset()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default EditClienteDrawer
