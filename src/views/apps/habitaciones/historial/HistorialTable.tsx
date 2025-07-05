'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
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
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Local Types
import type { HistorialHabitacion, TipoMovimiento } from './types'
import HistorialFilters from './HistorialFilters'

// Context Imports
import { useHistorial } from '@/contexts/HistorialContext'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type MovimientoColorType = {
  [key in TipoMovimiento]: ThemeColor
}

// Datos de prueba para el historial - ahora se cargan desde el contexto

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
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
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Vars
const movimientoColorObj: MovimientoColorType = {
  'check_in': 'success',
  'check_out': 'info',
  'cambio_estado': 'warning',
  'reserva': 'primary',
  'cancelacion': 'error'
}

const movimientoLabelObj: Record<TipoMovimiento, string> = {
  'check_in': 'Check-In',
  'check_out': 'Check-Out',
  'cambio_estado': 'Cambio Estado',
  'reserva': 'Reserva',
  'cancelacion': 'Cancelación'
}

// Column Definitions
const columnHelper = createColumnHelper<HistorialHabitacion>()

const HistorialTable = () => {
  // Context
  const { historial: historialData } = useHistorial()

  // States
  const [filteredData, setFilteredData] = useState<HistorialHabitacion[]>(historialData)
  const [globalFilter, setGlobalFilter] = useState('')

  // Update filtered data when historialData changes
  useEffect(() => {
    setFilteredData(historialData)
  }, [historialData])

  const columns = useMemo<ColumnDef<HistorialHabitacion, any>[]>(
    () => [
      columnHelper.accessor('fecha', {
        header: 'Fecha',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {new Date(row.original.fecha).toLocaleDateString('es-ES')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {row.original.hora}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('habitacionNombre', {
        header: 'Habitación',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.habitacionNombre}
          </Typography>
        )
      }),
      columnHelper.accessor('tipoMovimiento', {
        header: 'Tipo de Movimiento',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={movimientoLabelObj[row.original.tipoMovimiento]}
            size='small'
            color={movimientoColorObj[row.original.tipoMovimiento]}
            className='capitalize'
          />
        )
      }),
      columnHelper.accessor('estadoAnterior', {
        header: 'Cambio de Estado',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {row.original.estadoAnterior && (
              <>
                <Chip
                  variant='outlined'
                  label={row.original.estadoAnterior}
                  size='small'
                  className='capitalize'
                />
                <Icon className='tabler-arrow-right text-textSecondary' />
                <Chip
                  variant='tonal'
                  label={row.original.estadoNuevo}
                  size='small'
                  color='primary'
                  className='capitalize'
                />
              </>
            )}
            {!row.original.estadoAnterior && row.original.estadoNuevo && (
              <Chip
                variant='tonal'
                label={row.original.estadoNuevo}
                size='small'
                color='primary'
                className='capitalize'
              />
            )}
          </div>
        )
      }),
      columnHelper.accessor('huespedNombre', {
        header: 'Huésped',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            {row.original.huespedNombre && (
              <>
                <Typography color='text.primary' className='font-medium'>
                  {row.original.huespedNombre}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {row.original.huespedDocumento}
                </Typography>
              </>
            )}
            {!row.original.huespedNombre && (
              <Typography color='text.secondary'>-</Typography>
            )}
          </div>
        )
      }),
      columnHelper.accessor('observaciones', {
        header: 'Observaciones',
        cell: ({ row }) => (
          <Typography color='text.primary' className='max-w-xs truncate'>
            {row.original.observaciones || '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('usuario', {
        header: 'Usuario',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.usuario || '-'}
          </Typography>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      },
      sorting: [
        {
          id: 'fecha',
          desc: true
        }
      ]
    },
    globalFilterFn: fuzzyFilter,
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
        <HistorialFilters setData={setFilteredData} />
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
                    No hay registros de historial disponibles
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
                      <tr key={row.id}>
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
    </>
  )
}

export default HistorialTable
