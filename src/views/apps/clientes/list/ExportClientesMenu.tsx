// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'

// Types
import type { Cliente } from '@/contexts/ClientesContext'

// Utils
import { exportClientes, exportEstadisticasClientes } from '@/utils/exportClientesUtils'

type Props = {
  clientes: Cliente[]
}

const ExportClientesMenu = ({ clientes }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleExportClientesExcel = () => {
    exportClientes(clientes, 'excel')
    handleClose()
  }

  const handleExportClientesPDF = () => {
    exportClientes(clientes, 'pdf')
    handleClose()
  }

  const handleExportEstadisticasExcel = () => {
    exportEstadisticasClientes(clientes, 'excel')
    handleClose()
  }

  const handleExportEstadisticasPDF = () => {
    exportEstadisticasClientes(clientes, 'pdf')
    handleClose()
  }

  return (
    <>
      <Button
        color='secondary'
        variant='tonal'
        startIcon={<i className='tabler-upload' />}
        onClick={handleClick}
        aria-controls={open ? 'export-clientes-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        Exportar
      </Button>
      <Menu
        id="export-clientes-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-clientes-button',
        }}
      >
        <MenuItem onClick={handleExportClientesExcel}>
          <ListItemIcon>
            <i className="tabler-file-spreadsheet text-xl" />
          </ListItemIcon>
          <ListItemText>Clientes a Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportClientesPDF}>
          <ListItemIcon>
            <i className="tabler-file-text text-xl" />
          </ListItemIcon>
          <ListItemText>Clientes a PDF</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleExportEstadisticasExcel}>
          <ListItemIcon>
            <i className="tabler-chart-bar text-xl" />
          </ListItemIcon>
          <ListItemText>Estadísticas a Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportEstadisticasPDF}>
          <ListItemIcon>
            <i className="tabler-chart-pie text-xl" />
          </ListItemIcon>
          <ListItemText>Estadísticas a PDF</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ListItemIcon>
            <i className="tabler-info-circle text-xl" />
          </ListItemIcon>
          <ListItemText>
            <div>
              <div className="text-sm font-medium">Información</div>
              <div className="text-xs text-gray-500">
                {clientes.length} clientes disponibles
              </div>
            </div>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default ExportClientesMenu
