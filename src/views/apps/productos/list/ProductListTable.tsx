'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import TableFilters from './TableFilters'
import AddProductDrawer from './AddProductDrawer'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Types
import type { Producto } from '@/types/backend.types'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type ProductoWithAction = Producto & {
  action?: string
}

type ProductStockStatusType = {
  [key: string]: ThemeColor
}

// Datos de prueba locales
const productosData: Producto[] = [
  {
    id: 1,
    nombre: 'Coca Cola 500ml',
    descripcion: 'Bebida gaseosa sabor cola',
    precio: 3.50,
    stock: 25,
    stock_minimo: 5,
    categoria: 'Bebidas',
    sku: 'CC500',
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: 2,
    nombre: 'Inca Kola 500ml',
    descripcion: 'Bebida gaseosa sabor dorado',
    precio: 3.50,
    stock: 3,
    stock_minimo: 5,
    categoria: 'Bebidas',
    sku: 'IK500',
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: 3,
    nombre: 'Agua San Luis 625ml',
    descripcion: 'Agua mineral natural',
    precio: 2.00,
    stock: 0,
    stock_minimo: 10,
    categoria: 'Bebidas',
    sku: 'ASL625',
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: 4,
    nombre: 'Papas Lays Original',
    descripcion: 'Snack de papas fritas clásicas',
    precio: 4.50,
    stock: 15,
    stock_minimo: 5,
    categoria: 'Snacks',
    sku: 'PL001',
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: 5,
    nombre: 'Chocolate Sublime',
    descripcion: 'Chocolate con leche y maní',
    precio: 5.00,
    stock: 20,
    stock_minimo: 8,
    categoria: 'Dulces',
    sku: 'CS001',
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: 6,
    nombre: 'Galletas Oreo',
    descripcion: 'Galletas de chocolate con crema',
    precio: 6.50,
    stock: 12,
    stock_minimo: 5,
    categoria: 'Dulces',
    sku: 'GO001',
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: 7,
    nombre: 'Café Nescafé Instantáneo',
    descripcion: 'Café soluble instantáneo',
    precio: 8.00,
    stock: 8,
    stock_minimo: 3,
    categoria: 'Bebidas Calientes',
    sku: 'CN001',
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: 8,
    nombre: 'Shampoo Head & Shoulders',
    descripcion: 'Shampoo anticaspa 400ml',
    precio: 15.00,
    stock: 6,
    stock_minimo: 3,
    categoria: 'Higiene',
    sku: 'HS400',
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  }
]

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Vars
const productStockStatusObj: ProductStockStatusType = {
  'in-stock': 'success',
  'low-stock': 'warning',
  'out-of-stock': 'error'
}

// Column Definitions
const columnHelper = createColumnHelper<ProductoWithAction>()

const ProductListTable = () => {
  // States
  const [addProductOpen, setAddProductOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [productos, setProductos] = useState<Producto[]>(productosData)
  const [filteredData, setFilteredData] = useState<Producto[]>(productosData)
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  // Update filtered data when productos change
  useEffect(() => {
    setFilteredData(productos)
  }, [productos])

  // Helper function to get stock status
  const getStockStatus = (stock: number, minStock: number = 5) => {
    if (stock === 0) return { label: 'Agotado', color: 'out-of-stock' as keyof ProductStockStatusType }
    if (stock <= minStock) return { label: 'Poco Stock', color: 'low-stock' as keyof ProductStockStatusType }
    return { label: 'En Stock', color: 'in-stock' as keyof ProductStockStatusType }
  }

  // Handle delete product
  const handleDeleteProduct = (id: number) => {
    setProductos(prev => prev.filter(producto => producto.id !== id))
  }

  const columns = useMemo<ColumnDef<ProductoWithAction, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            #{row.original.id}
          </Typography>
        )
      }),
      columnHelper.accessor('nombre', {
        header: 'Nombre del Producto',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.nombre}
              </Typography>
              {row.original.descripcion && (
                <Typography variant='body2' color='text.secondary'>
                  {row.original.descripcion}
                </Typography>
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('stock', {
        header: 'Stock',
        cell: ({ row }) => {
          const stockStatus = getStockStatus(row.original.stock, row.original.stock_minimo)
          return (
            <div className='flex items-center gap-3'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.stock}
              </Typography>
              <Chip
                variant='tonal'
                label={stockStatus.label}
                size='small'
                color={productStockStatusObj[stockStatus.color]}
                className='capitalize'
              />
            </div>
          )
        }
      }),
      columnHelper.accessor('precio', {
        header: 'Precio',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.precio ? `S/ ${row.original.precio.toFixed(2)}` : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('categoria', {
        header: 'Categoría',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.categoria || '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Acciones',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => handleDeleteProduct(row.original.id)}
            >
              <i className='tabler-trash text-textSecondary' />
            </IconButton>
            <IconButton>
              <Link href={getLocalizedUrl(`/apps/productos/${row.original.id}`, locale as Locale)} className='flex'>
                <i className='tabler-eye text-textSecondary' />
              </Link>
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Editar',
                  icon: 'tabler-edit',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                },
                {
                  text: 'Actualizar Stock',
                  icon: 'tabler-package',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    [locale]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <Card>
        <CardHeader title='Filtros' className='pbe-4' />
        <TableFilters setData={setFilteredData} tableData={productos} />
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='max-sm:is-full sm:is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Buscar Producto'
              className='max-sm:is-full'
            />
            <Button
              color='secondary'
              variant='tonal'
              startIcon={<i className='tabler-upload' />}
              className='max-sm:is-full'
            >
              Exportar
            </Button>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setAddProductOpen(!addProductOpen)}
              className='max-sm:is-full'
            >
              Agregar Producto
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No hay productos disponibles
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
      <AddProductDrawer
        open={addProductOpen}
        handleClose={() => setAddProductOpen(!addProductOpen)}
      />
    </>
  )
}

export default ProductListTable
