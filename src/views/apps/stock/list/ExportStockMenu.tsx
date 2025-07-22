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

// Utils
import { exportStockHistory, exportEstadisticasStock } from '@/utils/exportPDFUtils'

type Props = {
  stockHistory: StockMovementType[]
}

const ExportStockMenu = ({ stockHistory }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleExportHistorialExcel = () => {
    exportStockHistory(stockHistory, 'excel')
    handleClose()
  }

  const handleExportHistorialPDF = () => {
    exportStockHistory(stockHistory, 'pdf')
    handleClose()
  }

  const handleExportEstadisticasExcel = () => {
    exportEstadisticasStock(stockHistory, 'excel')
    handleClose()
  }

  const handleExportEstadisticasPDF = () => {
    exportEstadisticasStock(stockHistory, 'pdf')
    handleClose()
  }

  return (
    <>
      <Button
        color='secondary'
        variant='tonal'
        startIcon={<i className='tabler-upload' />}
        onClick={handleClick}
        aria-controls={open ? 'export-stock-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        Exportar
      </Button>
      <Menu
        id="export-stock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-stock-button',
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
                {stockHistory.length} movimientos disponibles
              </div>
            </div>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default ExportStockMenu
