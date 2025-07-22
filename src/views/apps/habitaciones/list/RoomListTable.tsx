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
import AddRoomDrawer from './AddRoomDrawer'
import CheckInModal from './CheckInModal'
import CheckOutModal from './CheckOutModal'
import ReservaModal from './ReservaModal'
import ExportHabitacionesMenu from './ExportHabitacionesMenu'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Context Imports
import { useHabitaciones, type Habitacion } from '@/contexts/HabitacionesContext'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Types
type RoomTypeWithAction = Habitacion & {
  action?: string
}

type RoomStatusType = {
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
const roomStatusObj: RoomStatusType = {
  'ocupada': 'error',
  'vacia': 'success',
  'en-limpieza': 'warning',
  'reservada': 'info'
}

// Column Definitions
const columnHelper = createColumnHelper<RoomTypeWithAction>()

const RoomListTable = ({ tableData }: { tableData?: Habitacion[] }) => {
  // Context
  const {
    habitaciones: habitacionesData,
    eliminarHabitacion,
    cambiarEstadoHabitacion,
    realizarCheckIn,
    realizarCheckOut,
    crearReserva
  } = useHabitaciones()

  // States
  const [addRoomOpen, setAddRoomOpen] = useState(false)
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [checkOutOpen, setCheckOutOpen] = useState(false)
  const [reservaOpen, setReservaOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Habitacion | null>(null)
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<Habitacion[]>(habitacionesData)
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  // Update filtered data when habitaciones change
  useEffect(() => {
    setFilteredData(habitacionesData)
  }, [habitacionesData])

  // Helper function to get room status display
  const getRoomStatusDisplay = (estado: Habitacion['estado']) => {
    const statusMap = {
      'ocupada': { label: 'Ocupada', icon: 'tabler-user' },
      'vacia': { label: 'Vacía', icon: 'tabler-bed-off' },
      'en-limpieza': { label: 'En Limpieza', icon: 'tabler-vacuum-cleaner' },
      'reservada': { label: 'Reservada', icon: 'tabler-calendar-check' }
    }
    return statusMap[estado]
  }

  // Helper function to check if reservation is near (1-3 hours before)
  const isReservationNear = (fechaReserva?: string, horaReserva?: string) => {
    if (!fechaReserva || !horaReserva) return false

    const now = new Date()
    const reservationDateTime = new Date(`${fechaReserva}T${horaReserva}`)
    const timeDifference = reservationDateTime.getTime() - now.getTime()
    const hoursUntilReservation = timeDifference / (1000 * 60 * 60)

    // Return true if reservation is within 3 hours
    return hoursUntilReservation <= 3 && hoursUntilReservation > 0
  }

  // Handle Check-In
  const handleCheckIn = (roomId: number, checkInData: any) => {
    realizarCheckIn(roomId, checkInData)
  }

  // Handle Check-Out
  const handleCheckOut = (roomId: number, checkOutData: any) => {
    realizarCheckOut(roomId, checkOutData)
  }

  // Open Check-In Modal
  const openCheckInModal = (room: Habitacion) => {
    setSelectedRoom(room)
    setCheckInOpen(true)
  }

  // Open Check-Out Modal
  const openCheckOutModal = (room: Habitacion) => {
    setSelectedRoom(room)
    setCheckOutOpen(true)
  }

  // Handle Reserva
  const handleReserva = (roomId: number, reservaData: any) => {
    crearReserva(roomId, reservaData)
  }

  // Open Reserva Modal
  const openReservaModal = (room: Habitacion) => {
    setSelectedRoom(room)
    setReservaOpen(true)
  }

  const columns = useMemo<ColumnDef<RoomTypeWithAction, any>[]>(
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
      columnHelper.accessor('name', {
        header: 'Nombre de la Habitación',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.name}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('precio', {
        header: 'Precio por Noche',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.precio ? `S/ ${row.original.precio.toFixed(2)}` : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('estado', {
        header: 'Estado',
        cell: ({ row }) => {
          const statusDisplay = getRoomStatusDisplay(row.original.estado)
          const isNearReservation = row.original.estado === 'reservada' &&
                                   isReservationNear(row.original.fechaReserva, row.original.horaReserva)

          const handleEstadoChange = (newEstado: Habitacion['estado']) => {
            // If changing to 'reservada', open the reservation modal
            if (newEstado === 'reservada') {
              openReservaModal(row.original)
              return
            }

            // For other states, change directly using context
            cambiarEstadoHabitacion(row.original.id, newEstado)
          }

          return (
            <div className='flex items-center gap-3'>
              <Icon
                className={statusDisplay.icon}
                sx={{ color: `var(--mui-palette-${roomStatusObj[row.original.estado]}-main)` }}
              />
              <CustomTextField
                select
                size='small'
                value={row.original.estado}
                onChange={(e) => handleEstadoChange(e.target.value as Habitacion['estado'])}
                disabled={isNearReservation}
                sx={{
                  minWidth: 120,
                  opacity: isNearReservation ? 0.6 : 1
                }}
                title={isNearReservation ? 'No se puede cambiar: Reserva próxima (menos de 3 horas)' : ''}
              >
                <MenuItem value='vacia'>
                  <div className='flex items-center gap-2'>
                    <Icon className='tabler-bed-off' sx={{ color: 'var(--mui-palette-success-main)' }} />
                    Vacía
                  </div>
                </MenuItem>
                <MenuItem value='ocupada'>
                  <div className='flex items-center gap-2'>
                    <Icon className='tabler-user' sx={{ color: 'var(--mui-palette-error-main)' }} />
                    Ocupada
                  </div>
                </MenuItem>
                <MenuItem value='en-limpieza'>
                  <div className='flex items-center gap-2'>
                    <Icon className='tabler-vacuum-cleaner' sx={{ color: 'var(--mui-palette-warning-main)' }} />
                    En Limpieza
                  </div>
                </MenuItem>
                <MenuItem value='reservada'>
                  <div className='flex items-center gap-2'>
                    <Icon className='tabler-calendar-check' sx={{ color: 'var(--mui-palette-info-main)' }} />
                    Reservada
                  </div>
                </MenuItem>
              </CustomTextField>
              {isNearReservation && (
                <Icon
                  className='tabler-lock text-warning'
                  title='Bloqueado: Reserva próxima'
                />
              )}
            </div>
          )
        }
      }),
      columnHelper.accessor('fechaReserva', {
        header: 'Información de Reserva',
        cell: ({ row }) => {
          if (row.original.estado !== 'reservada' || !row.original.fechaReserva || !row.original.horaReserva) {
            return <Typography variant='body2' color='textSecondary'>-</Typography>
          }

          const isNearReservation = isReservationNear(row.original.fechaReserva, row.original.horaReserva)
          const now = new Date()
          const reservationDateTime = new Date(`${row.original.fechaReserva}T${row.original.horaReserva}`)
          const timeDifference = reservationDateTime.getTime() - now.getTime()
          const hoursUntilReservation = Math.max(0, timeDifference / (1000 * 60 * 60))

          return (
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <Icon className='tabler-calendar' />
                <Typography variant='body2' color='textPrimary'>
                  {row.original.fechaReserva}
                </Typography>
              </div>
              <div className='flex items-center gap-2'>
                <Icon className='tabler-clock' />
                <Typography variant='body2' color='textPrimary'>
                  {row.original.horaReserva}
                </Typography>
              </div>
              {isNearReservation && (
                <div className='flex items-center gap-1'>
                  <Icon className='tabler-alert-circle text-warning' />
                  <Typography variant='caption' color='warning.main'>
                    En {Math.floor(hoursUntilReservation)}h {Math.floor((hoursUntilReservation % 1) * 60)}min
                  </Typography>
                </div>
              )}
            </div>
          )
        }
      }),
      columnHelper.accessor('huespedNombre', {
        header: 'Huésped Actual',
        cell: ({ row }) => {
          if (!row.original.huespedNombre) {
            return <Typography variant='body2' color='textSecondary'>-</Typography>
          }

          return (
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <Icon className='tabler-user' />
                <Typography variant='body2' color='textPrimary' className='font-medium'>
                  {row.original.huespedNombre}
                </Typography>
              </div>
              <div className='flex items-center gap-2'>
                <Icon className='tabler-id' />
                <Typography variant='caption' color='textSecondary'>
                  {row.original.huespedDocumento}
                </Typography>
              </div>
              {row.original.fechaCheckIn && (
                <div className='flex items-center gap-2'>
                  <Icon className='tabler-clock-check' />
                  <Typography variant='caption' color='success.main'>
                    Check-in: {row.original.fechaCheckIn} {row.original.horaCheckIn}
                  </Typography>
                </div>
              )}
            </div>
          )
        }
      }),
      columnHelper.accessor('action', {
        header: 'Acciones',
        cell: ({ row }) => {
          const canCheckIn = row.original.estado === 'reservada'
          const canCheckOut = row.original.estado === 'ocupada'

          return (
            <div className='flex items-center gap-1'>
              {/* Check-In Button */}
              {canCheckIn && (
                <IconButton
                  onClick={() => openCheckInModal(row.original)}
                  title='Realizar Check-In'
                  color='success'
                  size='small'
                >
                  <i className='tabler-login' />
                </IconButton>
              )}

              {/* Check-Out Button */}
              {canCheckOut && (
                <IconButton
                  onClick={() => openCheckOutModal(row.original)}
                  title='Realizar Check-Out'
                  color='error'
                  size='small'
                >
                  <i className='tabler-logout' />
                </IconButton>
              )}

              <IconButton onClick={() => eliminarHabitacion(row.original.id)}>
                <i className='tabler-trash text-textSecondary' />
              </IconButton>
              <IconButton>
                <Link href={getLocalizedUrl('/apps/habitaciones/view', locale as Locale)} className='flex'>
                  <i className='tabler-eye text-textSecondary' />
                </Link>
              </IconButton>
              <OptionMenu
                iconButtonProps={{ size: 'medium' }}
                iconClassName='text-textSecondary'
                options={[
                  {
                    text: 'Cambiar Estado',
                    icon: 'tabler-refresh',
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
          )
        },
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [habitacionesData, filteredData]
  )

  const table = useReactTable({
    data: filteredData as Habitacion[],
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
        <TableFilters setData={setFilteredData} tableData={habitacionesData} />
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
              placeholder='Buscar Habitación'
              className='max-sm:is-full'
            />
            <ExportHabitacionesMenu habitaciones={habitacionesData} />
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setAddRoomOpen(!addRoomOpen)}
              className='max-sm:is-full'
            >
              Agregar Habitación
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
                    No hay habitaciones disponibles
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
      <AddRoomDrawer
        open={addRoomOpen}
        handleClose={() => setAddRoomOpen(!addRoomOpen)}
      />
      <CheckInModal
        open={checkInOpen}
        handleClose={() => {
          setCheckInOpen(false)
          setSelectedRoom(null)
        }}
        room={selectedRoom}
        onCheckIn={handleCheckIn}
      />
      <CheckOutModal
        open={checkOutOpen}
        handleClose={() => {
          setCheckOutOpen(false)
          setSelectedRoom(null)
        }}
        room={selectedRoom}
        onCheckOut={handleCheckOut}
      />
      <ReservaModal
        open={reservaOpen}
        handleClose={() => {
          setReservaOpen(false)
          setSelectedRoom(null)
        }}
        room={selectedRoom}
        onReserva={handleReserva}
      />
    </>
  )
}

export default RoomListTable
