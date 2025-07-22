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
import AddClientDrawer from './AddClientDrawer'
import ExportClientesMenu from './ExportClientesMenu'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Context Imports
import { useClientes, type Cliente } from '@/contexts/ClientesContext'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Types
type ClientTypeWithAction = Cliente & {
  action?: string
}

type ClientStatusType = {
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
const clientStatusObj: ClientStatusType = {
  'ACTIVO': 'success',
  'INACTIVO': 'error'
}

// Column Definitions
const columnHelper = createColumnHelper<ClientTypeWithAction>()

const ClientListTable = ({ tableData }: { tableData?: Cliente[] }) => {
  // Context
  const { clientes: clientesData, eliminarCliente } = useClientes()

  // States
  const [addClientOpen, setAddClientOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<Cliente[]>(clientesData)
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  // Update filtered data when clientes change
  useEffect(() => {
    setFilteredData(clientesData)
  }, [clientesData])

  // Helper function to get display name
  const getDisplayName = (client: Cliente) => {
    if (client.tipo_documento === 'DNI') {
      return client.nombre_completo || `${client.apellido_paterno} ${client.apellido_materno}, ${client.nombres}`
    }
    return client.nombre_o_razon_social || ''
  }

  // Helper function to get display address
  const getDisplayAddress = (client: Cliente) => {
    if (client.tipo_documento === 'RUC') {
      return client.direccion_completa || client.direccion || ''
    }
    return ''
  }

  const columns = useMemo<ColumnDef<ClientTypeWithAction, any>[]>(
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
      columnHelper.accessor('tipo_documento', {
        header: 'Tipo',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.tipo_documento}
            size='small'
            color={row.original.tipo_documento === 'DNI' ? 'primary' : 'secondary'}
            className='capitalize'
          />
        )
      }),
      columnHelper.accessor('numero_documento', {
        header: 'Documento',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.numero_documento}
          </Typography>
        )
      }),
      columnHelper.accessor('nombres', {
        header: 'Nombre / Razón Social',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {getDisplayName(row.original)}
              </Typography>
              {row.original.tipo_documento === 'DNI' && (
                <Typography variant='body2' color='text.secondary'>
                  {row.original.nombres}
                </Typography>
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('estado', {
        header: 'Estado',
        cell: ({ row }) => {
          if (row.original.tipo_documento === 'DNI') {
            return (
              <Chip
                variant='tonal'
                label='Activo'
                size='small'
                color='success'
                className='capitalize'
              />
            )
          }
          return (
            <Chip
              variant='tonal'
              label={row.original.estado || 'ACTIVO'}
              size='small'
              color={clientStatusObj[row.original.estado || 'ACTIVO']}
              className='capitalize'
            />
          )
        }
      }),
      columnHelper.accessor('direccion', {
        header: 'Dirección',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='body2' color='text.primary'>
              {getDisplayAddress(row.original)}
            </Typography>
            {row.original.tipo_documento === 'RUC' && (
              <Typography variant='body2' color='text.secondary'>
                {row.original.distrito}, {row.original.provincia}
              </Typography>
            )}
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Acciones',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => eliminarCliente(row.original.id)}>
              <i className='tabler-trash text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clientesData, filteredData]
  )

  const table = useReactTable({
    data: filteredData as Cliente[],
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
        <TableFilters setData={setFilteredData} tableData={clientesData} />
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
              placeholder='Buscar Cliente'
              className='max-sm:is-full'
            />
            <ExportClientesMenu clientes={clientesData} />
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setAddClientOpen(!addClientOpen)}
              className='max-sm:is-full'
            >
              Agregar Cliente
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
                    No hay clientes disponibles
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
      <AddClientDrawer
        open={addClientOpen}
        handleClose={() => setAddClientOpen(!addClientOpen)}
      />
    </>
  )
}

export default ClientListTable
