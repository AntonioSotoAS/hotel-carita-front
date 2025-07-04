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
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import { APIPERU_CONFIG, getAuthHeaders } from '@/config/apiperu.config'

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

type ModoEntrada = 'manual' | 'api'

const AddClientDrawer = (props: Props) => {
  // Props
  const { open, handleClose, clientData, setData } = props

  // States
  const [modoEntrada, setModoEntrada] = useState<ModoEntrada>('manual')
  const [tipoDocumento, setTipoDocumento] = useState<'DNI' | 'RUC'>('DNI')
  const [documentoBusqueda, setDocumentoBusqueda] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [datosEncontrados, setDatosEncontrados] = useState<any>(null)

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    setValue,
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

  // Función para consultar DNI
  const consultarDNI = async (dni: string) => {
    setIsLoading(true)
    setApiError(null)

    try {
      const response = await fetch(APIPERU_CONFIG.DNI_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ dni })
      })

      const result = await response.json()

      if (result.success && result.data) {
        const data = result.data
        setDatosEncontrados(data)

        // Llenar formulario automáticamente
        setValue('numero_documento', data.numero || dni)
        setValue('nombres', data.nombres || '')
        setValue('apellido_paterno', data.apellido_paterno || '')
        setValue('apellido_materno', data.apellido_materno || '')
        setValue('codigo_verificacion', data.codigo_verificacion || '')
      } else {
        setApiError('No se encontraron datos para este DNI')
      }
    } catch (error) {
      setApiError('Error al consultar la API. Verifica tu conexión.')
      console.error('Error consultando DNI:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para consultar RUC
  const consultarRUC = async (ruc: string) => {
    setIsLoading(true)
    setApiError(null)

    try {
      const response = await fetch(APIPERU_CONFIG.RUC_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ruc })
      })

      const result = await response.json()

      if (result.success && result.data) {
        const data = result.data
        setDatosEncontrados(data)

        // Llenar formulario automáticamente
        setValue('numero_documento', data.ruc || ruc)
        setValue('nombre_o_razon_social', data.nombre_o_razon_social || '')
        setValue('estado', data.estado || 'ACTIVO')
        setValue('condicion', data.condicion || 'HABIDO')
        setValue('direccion', data.direccion || '')
        setValue('direccion_completa', data.direccion_completa || '')
        setValue('departamento', data.departamento || '')
        setValue('provincia', data.provincia || '')
        setValue('distrito', data.distrito || '')
        setValue('ubigeo_sunat', data.ubigeo_sunat || '')
        setValue('es_agente_de_retencion', data.es_agente_de_retencion || 'NO')
        setValue('es_buen_contribuyente', data.es_buen_contribuyente || 'NO')
      } else {
        setApiError('No se encontraron datos para este RUC')
      }
    } catch (error) {
      setApiError('Error al consultar la API. Verifica tu conexión.')
      console.error('Error consultando RUC:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para buscar documento
  const buscarDocumento = () => {
    if (!documentoBusqueda) {
      setApiError('Ingresa un número de documento')
      return
    }

    if (tipoDocumento === 'DNI') {
      if (!/^\d{8}$/.test(documentoBusqueda)) {
        setApiError('El DNI debe tener 8 dígitos')
        return
      }
      consultarDNI(documentoBusqueda)
    } else {
      if (!/^\d{11}$/.test(documentoBusqueda)) {
        setApiError('El RUC debe tener 11 dígitos')
        return
      }
      consultarRUC(documentoBusqueda)
    }
  }

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
    handleReset()
  }

  const handleReset = () => {
    resetForm()
    setModoEntrada('manual')
    setTipoDocumento('DNI')
    setDocumentoBusqueda('')
    setApiError(null)
    setDatosEncontrados(null)
    setIsLoading(false)
  }

  const handleClose_ = () => {
    handleClose()
    handleReset()
  }

  const isApiMode = modoEntrada === 'api'
  const hasApiData = datosEncontrados !== null

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose_}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Agregar Nuevo Cliente</Typography>
        <IconButton size='small' onClick={handleClose_}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />

      <div className='p-6'>
        {/* Selector de modo de entrada */}
        <Card variant='outlined' className='mb-6'>
          <CardContent>
            <FormControl>
              <FormLabel>Modo de Entrada</FormLabel>
              <RadioGroup
                row
                value={modoEntrada}
                onChange={(e) => {
                  setModoEntrada(e.target.value as ModoEntrada)
                  setApiError(null)
                  setDatosEncontrados(null)
                  resetForm()
                }}
              >
                <FormControlLabel value='manual' control={<Radio />} label='Manual' />
                <FormControlLabel value='api' control={<Radio />} label='API (Automático)' />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        {/* Búsqueda automática via API */}
        {isApiMode && (
          <Card variant='outlined' className='mb-6'>
            <CardContent>
              <Typography variant='h6' className='mb-4'>Búsqueda Automática</Typography>

              <div className='flex flex-col gap-4'>
                <FormControl>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <RadioGroup
                    row
                    value={tipoDocumento}
                    onChange={(e) => {
                      setTipoDocumento(e.target.value as 'DNI' | 'RUC')
                      setValue('tipo_documento', e.target.value as 'DNI' | 'RUC')
                      setDocumentoBusqueda('')
                      setApiError(null)
                      setDatosEncontrados(null)
                    }}
                  >
                    <FormControlLabel value='DNI' control={<Radio />} label='DNI' />
                    <FormControlLabel value='RUC' control={<Radio />} label='RUC' />
                  </RadioGroup>
                </FormControl>

                <div className='flex gap-2'>
                  <CustomTextField
                    fullWidth
                    label={tipoDocumento === 'DNI' ? 'Número de DNI' : 'Número de RUC'}
                    placeholder={tipoDocumento === 'DNI' ? '12345678' : '20123456789'}
                    value={documentoBusqueda}
                    onChange={(e) => setDocumentoBusqueda(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    variant='contained'
                    onClick={buscarDocumento}
                    disabled={isLoading || !documentoBusqueda}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <i className='tabler-search' />}
                  >
                    Buscar
                  </Button>
                </div>

                {apiError && (
                  <Alert severity='error'>{apiError}</Alert>
                )}

                {hasApiData && (
                  <Alert severity='success'>
                    ¡Datos encontrados! Los campos se han llenado automáticamente.
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6'>
          {!isApiMode && (
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
          )}

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
                disabled={isApiMode && hasApiData}
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
                    disabled={isApiMode && hasApiData}
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
                    disabled={isApiMode && hasApiData}
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
                    disabled={isApiMode && hasApiData}
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
                    disabled={isApiMode && hasApiData}
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
                    disabled={isApiMode && hasApiData}
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
                    disabled={isApiMode && hasApiData}
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
                    disabled={isApiMode && hasApiData}
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
                    disabled={isApiMode && hasApiData}
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
                    disabled={isApiMode && hasApiData}
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
                    disabled={isApiMode && hasApiData}
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
                    disabled={isApiMode && hasApiData}
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
                    disabled={isApiMode && hasApiData}
                  />
                )}
              />
            </>
          )}

          <div className='flex items-center gap-4'>
            <Button
              variant='contained'
              type='submit'
              disabled={isApiMode && !hasApiData}
            >
              Agregar Cliente
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={handleClose_}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddClientDrawer
