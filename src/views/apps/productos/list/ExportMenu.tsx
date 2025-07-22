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
import type { Producto } from '@/types/backend.types'

// Utils
import { exportProductos } from '@/utils/exportPDFUtils'

type Props = {
  productos: Producto[]
}

const ExportMenu = ({ productos }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleExportExcel = () => {
    exportProductos(productos, 'excel')
    handleClose()
  }

  const handleExportPDF = () => {
    exportProductos(productos, 'pdf')
    handleClose()
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<i className="tabler-download" />}
        onClick={handleClick}
        aria-controls={open ? 'export-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        Exportar
      </Button>
      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
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
              <div className="text-sm font-medium">Información</div>
              <div className="text-xs text-gray-500">
                {productos.length} productos disponibles
              </div>
            </div>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default ExportMenu
