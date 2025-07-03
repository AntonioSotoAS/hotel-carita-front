// React Imports
import React, { useState } from 'react'

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
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Types
type StockMovementType = {
  id: number
  producto_id: number
  producto_nombre: string
  tipo_movimiento: 'entrada' | 'salida'
  cantidad: number
  stock_anterior: number
  stock_actual: number
  motivo: string
  fecha: string
  hora: string
  usuario: string
  observaciones?: string
}

type ProductType = {
  id: number
  name: string
  stock: number
}

type Props = {
  open: boolean
  handleClose: () => void
  stockData?: StockMovementType[]
  setData: (data: StockMovementType[]) => void
  productData?: ProductType[]
}

type FormValidateType = {
  producto_id: number
  tipo_movimiento: 'entrada' | 'salida'
  cantidad: number
  motivo: string
  fecha: string
  hora: string
  usuario: string
  observaciones: string
}

// Productos de ejemplo (en una aplicación real, esto vendría de una API)
const sampleProducts: ProductType[] = [
  { id: 1, name: 'Laptop HP Pavilion', stock: 47 },
  { id: 2, name: 'Mouse Logitech', stock: 95 },
  { id: 3, name: 'Teclado Mecánico', stock: 25 },
  { id: 4, name: 'Monitor Dell 24"', stock: 12 },
  { id: 5, name: 'Auriculares Sony', stock: 33 }
]

const AddStockMovementDrawer = (props: Props) => {
  // Props
  const { open, handleClose, stockData, setData, productData = sampleProducts } = props

  // States
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormValidateType>({
    defaultValues: {
      producto_id: 0,
      tipo_movimiento: 'entrada',
      cantidad: 1,
      motivo: '',
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
      usuario: 'Usuario Actual',
      observaciones: ''
    }
  })

  const watchProductId = watch('producto_id')
  const watchTipoMovimiento = watch('tipo_movimiento')

  // Update selected product when producto_id changes
  React.useEffect(() => {
    if (watchProductId) {
      const product = productData.find(p => p.id === Number(watchProductId))
      setSelectedProduct(product || null)
    }
  }, [watchProductId, productData])

  const onSubmit = (data: FormValidateType) => {
    const product = productData.find(p => p.id === Number(data.producto_id))
    if (!product) {
      alert('Por favor seleccione un producto válido')
      return
    }

    // Calculate new stock
    const stockAnterior = product.stock
    const newStock = data.tipo_movimiento === 'entrada'
      ? stockAnterior + data.cantidad
      : stockAnterior - data.cantidad

    // Validate stock doesn't go negative
    if (newStock < 0) {
      alert('No hay suficiente stock para realizar esta salida')
      return
    }

    const newMovement: StockMovementType = {
      id: (stockData?.length ? Math.max(...stockData.map(s => s.id)) + 1 : 1),
      producto_id: Number(data.producto_id),
      producto_nombre: product.name,
      tipo_movimiento: data.tipo_movimiento,
      cantidad: data.cantidad,
      stock_anterior: stockAnterior,
      stock_actual: newStock,
      motivo: data.motivo,
      fecha: data.fecha,
      hora: data.hora,
      usuario: data.usuario,
      observaciones: data.observaciones || undefined
    }

    setData([newMovement, ...(stockData ?? [])])
    handleClose()
    resetForm()
    setSelectedProduct(null)
  }

  const handleReset = () => {
    handleClose()
    resetForm()
    setSelectedProduct(null)
  }

  const getMotivosByType = (tipo: 'entrada' | 'salida') => {
    if (tipo === 'entrada') {
      return ['Compra', 'Devolución', 'Ajuste de inventario', 'Donación', 'Producción']
    } else {
      return ['Venta', 'Devolución de cliente', 'Daño/pérdida', 'Ajuste de inventario', 'Uso interno']
    }
  }

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
        <Typography variant='h5'>Registrar Movimiento de Stock</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6 p-6'>
          <Controller
            name='producto_id'
            control={control}
            rules={{ required: 'Debe seleccionar un producto' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                select
                fullWidth
                label='Producto'
                {...(errors.producto_id && { error: true, helperText: errors.producto_id.message })}
              >
                <MenuItem value={0}>Seleccionar producto</MenuItem>
                {productData.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} (Stock actual: {product.stock})
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />

          {selectedProduct && (
            <div className='p-4 bg-gray-50 rounded-lg'>
              <Typography variant='subtitle2' color='text.primary'>
                Producto seleccionado: {selectedProduct.name}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Stock actual: {selectedProduct.stock} unidades
              </Typography>
            </div>
          )}

          <FormControl>
            <FormLabel>Tipo de Movimiento</FormLabel>
            <Controller
              name='tipo_movimiento'
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel value='entrada' control={<Radio />} label='Entrada (+)' />
                  <FormControlLabel value='salida' control={<Radio />} label='Salida (-)' />
                </RadioGroup>
              )}
            />
          </FormControl>

          <Controller
            name='cantidad'
            control={control}
            rules={{
              required: 'La cantidad es requerida',
              min: { value: 1, message: 'La cantidad debe ser mayor a 0' },
              validate: (value) => {
                if (watchTipoMovimiento === 'salida' && selectedProduct && value > selectedProduct.stock) {
                  return `No hay suficiente stock. Disponible: ${selectedProduct.stock}`
                }
                return true
              }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='number'
                label='Cantidad'
                placeholder='1'
                inputProps={{ min: 1, step: 1 }}
                {...(errors.cantidad && { error: true, helperText: errors.cantidad.message })}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              />
            )}
          />

          <Controller
            name='motivo'
            control={control}
            rules={{ required: 'El motivo es requerido' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                select
                fullWidth
                label='Motivo'
                {...(errors.motivo && { error: true, helperText: errors.motivo.message })}
              >
                <MenuItem value=''>Seleccionar motivo</MenuItem>
                {getMotivosByType(watchTipoMovimiento).map((motivo) => (
                  <MenuItem key={motivo} value={motivo}>
                    {motivo}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />

          <div className='flex gap-4'>
            <Controller
              name='fecha'
              control={control}
              rules={{ required: 'La fecha es requerida' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type='date'
                  label='Fecha'
                  InputLabelProps={{ shrink: true }}
                  {...(errors.fecha && { error: true, helperText: errors.fecha.message })}
                />
              )}
            />
            <Controller
              name='hora'
              control={control}
              rules={{ required: 'La hora es requerida' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type='time'
                  label='Hora'
                  InputLabelProps={{ shrink: true }}
                  {...(errors.hora && { error: true, helperText: errors.hora.message })}
                />
              )}
            />
          </div>

          <Controller
            name='usuario'
            control={control}
            rules={{ required: 'El usuario es requerido' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Usuario'
                placeholder='Nombre del usuario'
                {...(errors.usuario && { error: true, helperText: errors.usuario.message })}
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
                label='Observaciones (Opcional)'
                placeholder='Detalles adicionales sobre el movimiento...'
              />
            )}
          />

          {selectedProduct && watchTipoMovimiento && (
            <div className='p-4 bg-blue-50 rounded-lg'>
              <Typography variant='subtitle2' color='primary'>
                Resumen del movimiento:
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Stock actual: {selectedProduct.stock} →
                Stock después: {watchTipoMovimiento === 'entrada'
                  ? selectedProduct.stock + (watch('cantidad') || 0)
                  : selectedProduct.stock - (watch('cantidad') || 0)}
              </Typography>
            </div>
          )}

          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Registrar Movimiento
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

export default AddStockMovementDrawer
