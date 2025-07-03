'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
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

// Component Imports
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import StockHistoryFilters from './StockHistoryFilters'
import AddStockMovementDrawer from './AddStockMovementDrawer'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

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

type StockMovementWithAction = StockMovementType & {
  action?: string
}

type MovementStatusType = {
  [key: string]: ThemeColor
}

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
const movementStatusObj: MovementStatusType = {
  'entrada': 'success',
  'salida': 'error'
}

// Datos de ejemplo
const sampleStockHistoryData: StockMovementType[] = [
  {
    id: 1,
    producto_id: 1,
    producto_nombre: 'Laptop HP Pavilion',
    tipo_movimiento: 'entrada',
    cantidad: 50,
    stock_anterior: 0,
    stock_actual: 50,
    motivo: 'Compra inicial',
    fecha: '2024-01-15',
    hora: '10:30',
    usuario: 'Admin',
    observaciones: 'Primer lote de laptops'
  },
  {
    id: 2,
    producto_id: 1,
    producto_nombre: 'Laptop HP Pavilion',
    tipo_movimiento: 'salida',
    cantidad: 2,
    stock_anterior: 50,
    stock_actual: 48,
    motivo: 'Venta',
    fecha: '2024-01-16',
    hora: '14:20',
    usuario: 'Vendedor1',
    observaciones: 'Venta a cliente empresarial'
  },
  {
    id: 3,
    producto_id: 2,
    producto_nombre: 'Mouse Logitech',
    tipo_movimiento: 'entrada',
    cantidad: 100,
    stock_anterior: 0,
    stock_actual: 100,
    motivo: 'Compra',
    fecha: '2024-01-17',
    hora: '09:15',
    usuario: 'Admin',
    observaciones: 'Restock de mouse'
  },
  {
    id: 4,
    producto_id: 1,
    producto_nombre: 'Laptop HP Pavilion',
    tipo_movimiento: 'salida',
    cantidad: 1,
    stock_anterior: 48,
    stock_actual: 47,
    motivo: 'Venta',
    fecha: '2024-01-18',
    hora: '11:45',
    usuario: 'Vendedor2',
    observaciones: 'Venta individual'
  },
  {
    id: 5,
    producto_id: 2,
    producto_nombre: 'Mouse Logitech',
    tipo_movimiento: 'salida',
    cantidad: 5,
    stock_anterior: 100,
    stock_actual: 95,
    motivo: 'Venta',
    fecha: '2024-01-19',
    hora: '16:30',
    usuario: 'Vendedor1',
    observaciones: 'Venta múltiple'
  }
]

// Column Definitions
const columnHelper = createColumnHelper<StockMovementWithAction>()

const StockHistoryTable = ({ tableData }: { tableData?: StockMovementType[] }) => {
  // States
  const [addMovementOpen, setAddMovementOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData || sampleStockHistoryData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<StockMovementWithAction, any>[]>(
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
      columnHelper.accessor('fecha', {
        header: 'Fecha y Hora',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.fecha}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {row.original.hora}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('producto_nombre', {
        header: 'Producto',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.producto_nombre}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              ID: {row.original.producto_id}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('tipo_movimiento', {
        header: 'Tipo',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Chip
              variant='tonal'
              label={row.original.tipo_movimiento.toUpperCase()}
              size='small'
              color={movementStatusObj[row.original.tipo_movimiento]}
              className='capitalize'
            />
            <i className={`text-xl ${row.original.tipo_movimiento === 'entrada' ? 'tabler-arrow-down text-success' : 'tabler-arrow-up text-error'}`} />
          </div>
        )
      }),
      columnHelper.accessor('cantidad', {
        header: 'Cantidad',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.tipo_movimiento === 'entrada' ? '+' : '-'}{row.original.cantidad}
          </Typography>
        )
      }),
      columnHelper.accessor('stock_anterior', {
        header: 'Stock Anterior → Actual',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Typography color='text.secondary'>
              {row.original.stock_anterior}
            </Typography>
            <i className='tabler-arrow-right text-textSecondary' />
            <Typography color='text.primary' className='font-medium'>
              {row.original.stock_actual}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('motivo', {
        header: 'Motivo',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.motivo}
            </Typography>
            {row.original.observaciones && (
              <Typography variant='body2' color='text.secondary'>
                {row.original.observaciones}
              </Typography>
            )}
          </div>
        )
      }),
      columnHelper.accessor('usuario', {
        header: 'Usuario',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.usuario}
          </Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Acciones',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => setData(data?.filter(movement => movement.id !== row.original.id))}>
              <i className='tabler-trash text-textSecondary' />
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Ver Detalles',
                  icon: 'tabler-eye',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                },
                {
                  text: 'Editar',
                  icon: 'tabler-edit',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData as StockMovementType[],
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
        <StockHistoryFilters setData={setFilteredData} tableData={data} />
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
              placeholder='Buscar en historial'
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
              onClick={() => setAddMovementOpen(!addMovementOpen)}
              className='max-sm:is-full'
            >
              Registrar Movimiento
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
                    No hay movimientos de stock registrados
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
      <AddStockMovementDrawer
        open={addMovementOpen}
        handleClose={() => setAddMovementOpen(!addMovementOpen)}
        stockData={data}
        setData={setData}
      />
    </>
  )
}

export default StockHistoryTable
