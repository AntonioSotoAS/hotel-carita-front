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
import type { HistorialHabitacion } from './types'

// Utils
import { exportHistorial, exportEstadisticasHistorial } from '@/utils/exportPDFUtils'

type Props = {
  historial: HistorialHabitacion[]
}

const ExportHistorialMenu = ({ historial }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleExportHistorialExcel = () => {
    exportHistorial(historial, 'excel')
    handleClose()
  }

  const handleExportHistorialPDF = () => {
    exportHistorial(historial, 'pdf')
    handleClose()
  }

  const handleExportEstadisticasExcel = () => {
    exportEstadisticasHistorial(historial, 'excel')
    handleClose()
  }

  const handleExportEstadisticasPDF = () => {
    exportEstadisticasHistorial(historial, 'pdf')
    handleClose()
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<i className="tabler-download" />}
        onClick={handleClick}
        aria-controls={open ? 'export-historial-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        Exportar
      </Button>
      <Menu
        id="export-historial-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-historial-button',
        }}
      >
        <MenuItem onClick={handleExportHistorialExcel}>
          <ListItemIcon>
            <i className="tabler-file-spreadsheet text-xl" />
          </ListItemIcon>
          <ListItemText>Historial a Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportHistorialPDF}>
          <ListItemIcon>
            <i className="tabler-file-text text-xl" />
          </ListItemIcon>
          <ListItemText>Historial a PDF</ListItemText>
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
                {historial.length} registros disponibles
              </div>
            </div>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default ExportHistorialMenu
