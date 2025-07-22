// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'

// Utils
import { exportEstadisticas } from '@/utils/exportPDFUtils'

type Props = {
  estadisticas: any
  size?: 'small' | 'medium' | 'large'
  variant?: 'text' | 'outlined' | 'contained'
}

const ExportEstadisticasMenu = ({
  estadisticas,
  size = 'medium',
  variant = 'outlined'
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleExportExcel = () => {
    exportEstadisticas(estadisticas, 'excel')
    handleClose()
  }

  const handleExportPDF = () => {
    exportEstadisticas(estadisticas, 'pdf')
    handleClose()
  }

  return (
    <>
      <Button
        size={size}
        variant={variant}
        startIcon={<i className="tabler-chart-bar" />}
        onClick={handleClick}
        aria-controls={open ? 'export-stats-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        Exportar Estadísticas
      </Button>
      <Menu
        id="export-stats-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-stats-button',
        }}
      >
        <MenuItem onClick={handleExportExcel}>
          <ListItemIcon>
            <i className="tabler-file-spreadsheet text-xl" />
          </ListItemIcon>
          <ListItemText>Exportar a Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportPDF}>
          <ListItemIcon>
            <i className="tabler-file-text text-xl" />
          </ListItemIcon>
          <ListItemText>Exportar a PDF</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ListItemIcon>
            <i className="tabler-info-circle text-xl" />
          </ListItemIcon>
          <ListItemText>
            <div>
              <div className="text-sm font-medium">Estadísticas del Sistema</div>
              <div className="text-xs text-gray-500">
                Incluye productos y clientes
              </div>
            </div>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default ExportEstadisticasMenu
