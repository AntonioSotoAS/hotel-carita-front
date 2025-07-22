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

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Contexts
import { useProductos } from '@/contexts/ProductosContext'

// Types
import type { Producto } from '@/types/backend.types'

type Props = {
  open: boolean
  handleClose: () => void
  producto: Producto | null
}

type FormValidateType = {
  nombre: string
  descripcion?: string
  stock: number
  precio?: number
  sku?: string
  categoria?: string
  stock_minimo: number
  activo: boolean
}

const EditProductDrawer = (props: Props) => {
  // Props
  const { open, handleClose, producto } = props

  // Context
  const { actualizarProducto } = useProductos()

  // States
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormValidateType>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      stock: 0,
      precio: 0,
      sku: '',
      categoria: '',
      stock_minimo: 5,
      activo: true
    }
  })

  // Cargar datos del producto cuando se abre el drawer
  useEffect(() => {
    if (producto && open) {
      setValue('nombre', producto.nombre)
      setValue('descripcion', producto.descripcion || '')
      setValue('stock', producto.stock)
      setValue('precio', producto.precio || 0)
      setValue('sku', producto.sku || '')
      setValue('categoria', producto.categoria || '')
      setValue('stock_minimo', producto.stock_minimo)
      setValue('activo', producto.activo)
    }
  }, [producto, open, setValue])

  const onSubmit = async (data: FormValidateType) => {
    if (!producto) return

    setIsSubmitting(true)

    try {
      // Actualizar producto con datos del formulario
      const productoActualizado: Partial<Producto> = {
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        stock: data.stock,
        precio: data.precio || 0,
        sku: data.sku || producto.sku,
        categoria: data.categoria || '',
        stock_minimo: data.stock_minimo,
        activo: data.activo,
        fechaActualizacion: new Date().toISOString()
      }

      // Usar el contexto para actualizar el producto
      actualizarProducto(producto.id, productoActualizado)

      // Cerrar drawer y resetear form
      handleClose()
      resetForm()
    } catch (error) {
      console.error('Error al actualizar producto:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    handleClose()
    resetForm()
  }

  const categorias = [
    'Bebidas',
    'Snacks',
    'Dulces',
    'Bebidas Calientes',
    'Higiene',
    'Comida',
    'Electrónicos',
    'Otros'
  ]

  if (!producto) return null

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 350, sm: 450 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Editar Producto</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />

      {/* Información del producto */}
      <div className='p-6 bg-gray-50'>
        <Typography variant='subtitle2' color='text.secondary' gutterBottom>
          ID: {producto.id}
        </Typography>
        <Typography variant='subtitle2' color='text.secondary' gutterBottom>
          Creado: {new Date(producto.fechaCreacion).toLocaleDateString()}
        </Typography>
        {producto.fechaActualizacion && (
          <Typography variant='subtitle2' color='text.secondary'>
            Última actualización: {new Date(producto.fechaActualizacion).toLocaleDateString()}
          </Typography>
        )}
      </div>

      <div>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6 p-6'>
          <Controller
            name='nombre'
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
                label='Nombre del Producto *'
                placeholder='Ej: Coca Cola 500ml'
                {...(errors.nombre && { error: true, helperText: errors.nombre.message })}
              />
            )}
          />

          <Controller
            name='descripcion'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                multiline
                rows={3}
                label='Descripción'
                placeholder='Descripción detallada del producto'
              />
            )}
          />

          <div className='flex gap-4'>
            <Controller
              name='stock'
              control={control}
              rules={{
                required: 'Este campo es requerido',
                min: {
                  value: 0,
                  message: 'El stock no puede ser negativo'
                }
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type='number'
                  label='Stock Actual *'
                  placeholder='0'
                  inputProps={{ min: 0, step: 1 }}
                  {...(errors.stock && { error: true, helperText: errors.stock.message })}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              )}
            />

            <Controller
              name='stock_minimo'
              control={control}
              rules={{
                required: 'Este campo es requerido',
                min: {
                  value: 1,
                  message: 'El stock mínimo debe ser mayor a 0'
                }
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type='number'
                  label='Stock Mínimo *'
                  placeholder='5'
                  inputProps={{ min: 1, step: 1 }}
                  {...(errors.stock_minimo && { error: true, helperText: errors.stock_minimo.message })}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                />
              )}
            />
          </div>

          <Controller
            name='precio'
            control={control}
            rules={{
              min: {
                value: 0,
                message: 'El precio no puede ser negativo'
              }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='number'
                label='Precio'
                placeholder='0.00'
                inputProps={{ min: 0, step: 0.01 }}
                {...(errors.precio && { error: true, helperText: errors.precio.message })}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />

          <Controller
            name='sku'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='SKU'
                placeholder='Ej: CC500'
              />
            )}
          />

          <Controller
            name='categoria'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  {...field}
                  label='Categoría'
                >
                  <MenuItem value=''>
                    <em>Seleccionar categoría</em>
                  </MenuItem>
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria} value={categoria}>
                      {categoria}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name='activo'
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    color="primary"
                  />
                }
                label="Producto Activo"
              />
            )}
          />

          <div className='flex items-center gap-4'>
            <Button
              variant='contained'
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Actualizar Producto'}
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

export default EditProductDrawer
