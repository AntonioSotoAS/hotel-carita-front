// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Types
type ClientType = {
  id: number
  tipo_documento: 'DNI' | 'RUC'
  numero_documento: string

  // Datos para DNI (persona natural)
  nombres?: string
  apellido_paterno?: string
  apellido_materno?: string
  nombre_completo?: string
  codigo_verificacion?: string

  // Datos para RUC (empresa)
  nombre_o_razon_social?: string
  estado?: string
  condicion?: string
  direccion?: string
  direccion_completa?: string
  departamento?: string
  provincia?: string
  distrito?: string
  ubigeo_sunat?: string
  ubigeo?: string[]
  es_agente_de_retencion?: string
  es_buen_contribuyente?: string
}

type Props = {
  open: boolean
  handleClose: () => void
  clientData?: ClientType[]
  setData: (data: ClientType[]) => void
}

type FormValidateType = {
  tipo_documento: 'DNI' | 'RUC'
  numero_documento: string

  // Campos DNI
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  codigo_verificacion: string

  // Campos RUC
  nombre_o_razon_social: string
  estado: string
  condicion: string
  direccion: string
  direccion_completa: string
  departamento: string
  provincia: string
  distrito: string
  ubigeo_sunat: string
  es_agente_de_retencion: string
  es_buen_contribuyente: string
}

const AddClientDrawer = (props: Props) => {
  // Props
  const { open, handleClose, clientData, setData } = props

  // States
  const [tipoDocumento, setTipoDocumento] = useState<'DNI' | 'RUC'>('DNI')

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormValidateType>({
    defaultValues: {
      tipo_documento: 'DNI',
      numero_documento: '',
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      codigo_verificacion: '',
      nombre_o_razon_social: '',
      estado: 'ACTIVO',
      condicion: 'HABIDO',
      direccion: '',
      direccion_completa: '',
      departamento: '',
      provincia: '',
      distrito: '',
      ubigeo_sunat: '',
      es_agente_de_retencion: 'NO',
      es_buen_contribuyente: 'NO'
    }
  })

  const watchTipoDocumento = watch('tipo_documento')

  const onSubmit = (data: FormValidateType) => {
    const newClient: ClientType = {
      id: (clientData?.length ? Math.max(...clientData.map(c => c.id)) + 1 : 1),
      tipo_documento: data.tipo_documento,
      numero_documento: data.numero_documento,
      ...(data.tipo_documento === 'DNI' ? {
        nombres: data.nombres,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        nombre_completo: `${data.apellido_paterno} ${data.apellido_materno}, ${data.nombres}`,
        codigo_verificacion: data.codigo_verificacion
      } : {
        nombre_o_razon_social: data.nombre_o_razon_social,
        estado: data.estado,
        condicion: data.condicion,
        direccion: data.direccion,
        direccion_completa: data.direccion_completa,
        departamento: data.departamento,
        provincia: data.provincia,
        distrito: data.distrito,
        ubigeo_sunat: data.ubigeo_sunat,
        es_agente_de_retencion: data.es_agente_de_retencion,
        es_buen_contribuyente: data.es_buen_contribuyente
      })
    }

    setData([...(clientData ?? []), newClient])
    handleClose()
    resetForm()
  }

  const handleReset = () => {
    handleClose()
    resetForm()
    setTipoDocumento('DNI')
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Agregar Nuevo Cliente</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6 p-6'>
          <FormControl>
            <FormLabel>Tipo de Documento</FormLabel>
            <Controller
              name='tipo_documento'
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  onChange={(e) => {
                    field.onChange(e)
                    setTipoDocumento(e.target.value as 'DNI' | 'RUC')
                  }}
                >
                  <FormControlLabel value='DNI' control={<Radio />} label='DNI - Persona Natural' />
                  <FormControlLabel value='RUC' control={<Radio />} label='RUC - Empresa' />
                </RadioGroup>
              )}
            />
          </FormControl>

          <Controller
            name='numero_documento'
            control={control}
            rules={{
              required: 'Este campo es requerido',
              pattern: {
                value: watchTipoDocumento === 'DNI' ? /^\d{8}$/ : /^\d{11}$/,
                message: watchTipoDocumento === 'DNI' ? 'El DNI debe tener 8 dígitos' : 'El RUC debe tener 11 dígitos'
              }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label={watchTipoDocumento === 'DNI' ? 'Número de DNI' : 'Número de RUC'}
                placeholder={watchTipoDocumento === 'DNI' ? '12345678' : '20123456789'}
                {...(errors.numero_documento && { error: true, helperText: errors.numero_documento.message })}
              />
            )}
          />

          {watchTipoDocumento === 'DNI' ? (
            <>
              <Controller
                name='nombres'
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Nombres'
                    placeholder='Ej: Juan Carlos'
                    {...(errors.nombres && { error: true, helperText: errors.nombres.message })}
                  />
                )}
              />
              <Controller
                name='apellido_paterno'
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Apellido Paterno'
                    placeholder='Ej: Pérez'
                    {...(errors.apellido_paterno && { error: true, helperText: errors.apellido_paterno.message })}
                  />
                )}
              />
              <Controller
                name='apellido_materno'
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Apellido Materno'
                    placeholder='Ej: García'
                    {...(errors.apellido_materno && { error: true, helperText: errors.apellido_materno.message })}
                  />
                )}
              />
              <Controller
                name='codigo_verificacion'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Código de Verificación'
                    placeholder='Ej: 1'
                    inputProps={{ maxLength: 1 }}
                  />
                )}
              />
            </>
          ) : (
            <>
              <Controller
                name='nombre_o_razon_social'
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Razón Social'
                    placeholder='Ej: EMPRESA DEMO S.A.C.'
                    {...(errors.nombre_o_razon_social && { error: true, helperText: errors.nombre_o_razon_social.message })}
                  />
                )}
              />
              <Controller
                name='estado'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    select
                    label='Estado'
                    SelectProps={{ native: true }}
                  >
                    <option value='ACTIVO'>ACTIVO</option>
                    <option value='INACTIVO'>INACTIVO</option>
                  </CustomTextField>
                )}
              />
              <Controller
                name='condicion'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    select
                    label='Condición'
                    SelectProps={{ native: true }}
                  >
                    <option value='HABIDO'>HABIDO</option>
                    <option value='NO HABIDO'>NO HABIDO</option>
                  </CustomTextField>
                )}
              />
              <Controller
                name='direccion'
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Dirección'
                    placeholder='Ej: JR. ANDAHUAYLAS NRO. 100 INT. 201'
                    {...(errors.direccion && { error: true, helperText: errors.direccion.message })}
                  />
                )}
              />
              <Controller
                name='departamento'
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Departamento'
                    placeholder='Ej: LIMA'
                    {...(errors.departamento && { error: true, helperText: errors.departamento.message })}
                  />
                )}
              />
              <Controller
                name='provincia'
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Provincia'
                    placeholder='Ej: LIMA'
                    {...(errors.provincia && { error: true, helperText: errors.provincia.message })}
                  />
                )}
              />
              <Controller
                name='distrito'
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Distrito'
                    placeholder='Ej: MAGDALENA DEL MAR'
                    {...(errors.distrito && { error: true, helperText: errors.distrito.message })}
                  />
                )}
              />
              <Controller
                name='ubigeo_sunat'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Ubigeo SUNAT'
                    placeholder='Ej: 150101'
                  />
                )}
              />
            </>
          )}

          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Agregar Cliente
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

export default AddClientDrawer
