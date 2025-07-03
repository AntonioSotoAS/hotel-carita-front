// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Types
import type { Producto } from '@/types/backend.types'

const TableFilters = ({ setData, tableData }: { setData: (data: Producto[]) => void; tableData?: Producto[] }) => {
  // States
  const [stockStatus, setStockStatus] = useState<string>('')
  const [stockRange, setStockRange] = useState<string>('')
  const [nameFilter, setNameFilter] = useState<string>('')

  useEffect(() => {
    const filteredData = tableData?.filter(product => {
      // Filter by stock status
      if (stockStatus) {
        if (stockStatus === 'out-of-stock' && product.stock !== 0) return false
        if (stockStatus === 'low-stock' && (product.stock === 0 || product.stock > product.stock_minimo)) return false
        if (stockStatus === 'in-stock' && product.stock <= product.stock_minimo) return false
      }

      // Filter by stock range
      if (stockRange) {
        if (stockRange === '0-10' && (product.stock < 0 || product.stock > 10)) return false
        if (stockRange === '11-50' && (product.stock < 11 || product.stock > 50)) return false
        if (stockRange === '51-100' && (product.stock < 51 || product.stock > 100)) return false
        if (stockRange === '100+' && product.stock <= 100) return false
      }

      // Filter by name
      if (nameFilter && !product.nombre.toLowerCase().includes(nameFilter.toLowerCase())) return false

      return true
    })

    setData(filteredData || [])
  }, [stockStatus, stockRange, nameFilter, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-stock-status'
            value={stockStatus}
            onChange={e => setStockStatus(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Estado del Stock</MenuItem>
            <MenuItem value='in-stock'>En Stock</MenuItem>
            <MenuItem value='low-stock'>Poco Stock</MenuItem>
            <MenuItem value='out-of-stock'>Agotado</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-stock-range'
            value={stockRange}
            onChange={e => setStockRange(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Rango de Stock</MenuItem>
            <MenuItem value='0-10'>0 - 10</MenuItem>
            <MenuItem value='11-50'>11 - 50</MenuItem>
            <MenuItem value='51-100'>51 - 100</MenuItem>
            <MenuItem value='100+'>100+</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            fullWidth
            id='filter-name'
            value={nameFilter}
            onChange={e => setNameFilter(e.target.value)}
            placeholder='Filtrar por nombre'
          />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
