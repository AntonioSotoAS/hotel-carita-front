// React Imports
import { useState } from 'react'

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

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Hooks
import { useProductos } from '@/hooks/useProductos'

// Types
import type { CrearProductoDto } from '@/types/backend.types'

type Props = {
  open: boolean
  handleClose: () => void
}

type FormValidateType = {
  name: string
  description?: string
  stock: number
  price?: number
  sku?: string
  category?: string
  unit?: string
  min_stock: number
}

const AddProductDrawer = (props: Props) => {
  // Props
  const { open, handleClose } = props

  // States
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hooks
  const { crearProducto } = useProductos()
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues: {
      name: '',
      description: '',
      stock: 0,
      price: 0,
      sku: '',
      category: '',
      unit: 'unidades',
      min_stock: 5
    }
  })

  const onSubmit = async (data: FormValidateType) => {
    setIsSubmitting(true)

    try {
      const productoData: CrearProductoDto = {
        name: data.name,
        description: data.description || undefined,
        stock: data.stock,
        price: data.price || undefined,
        sku: data.sku || undefined,
        category: data.category || undefined,
        unit: data.unit || undefined,
        min_stock: data.min_stock,
        is_active: true
      }

      const success = crearProducto(productoData)

      if (success) {
        handleClose()
        resetForm()
      }
    } catch (error) {
      console.error('Error al crear producto:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    handleClose()
    resetForm()
  }

  const categorias = [
    'Electrónicos',
    'Ropa',
    'Hogar',
    'Deportes',
    'Libros',
    'Salud',
    'Automotriz',
    'Oficina',
    'Otros'
  ]

  const unidades = [
    'unidades',
    'kg',
    'litros',
    'metros',
    'cajas',
    'paquetes'
  ]

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
        <Typography variant='h5'>Agregar Nuevo Producto</Typography>
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
                label='Nombre del Producto *'
                placeholder='Ej: Laptop HP'
                {...(errors.name && { error: true, helperText: errors.name.message })}
              />
            )}
          />

          <Controller
            name='description'
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
                  label='Stock Inicial *'
                  placeholder='0'
                  inputProps={{ min: 0, step: 1 }}
                  {...(errors.stock && { error: true, helperText: errors.stock.message })}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              )}
            />

            <Controller
              name='min_stock'
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
                  {...(errors.min_stock && { error: true, helperText: errors.min_stock.message })}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                />
              )}
            />
          </div>

          <Controller
            name='price'
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
                {...(errors.price && { error: true, helperText: errors.price.message })}
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
                placeholder='Ej: LAP-HP-001'
              />
            )}
          />

          <Controller
            name='category'
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
            name='unit'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Unidad de Medida</InputLabel>
                <Select
                  {...field}
                  label='Unidad de Medida'
                >
                  {unidades.map((unidad) => (
                    <MenuItem key={unidad} value={unidad}>
                      {unidad}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <div className='flex items-center gap-4'>
            <Button
              variant='contained'
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Agregar Producto'}
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

export default AddProductDrawer
