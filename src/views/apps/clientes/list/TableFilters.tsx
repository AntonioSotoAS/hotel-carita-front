// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Types
type ClientType = {
  id: number
  tipo_documento: 'DNI' | 'RUC'
  numero_documento: string

  // Datos para DNI (persona natural)
  nombres?: string
  apellido_paterno?: string
  apellido_materno?: string
  nombre_completo?: string
  codigo_verificacion?: string

  // Datos para RUC (empresa)
  nombre_o_razon_social?: string
  estado?: string
  condicion?: string
  direccion?: string
  direccion_completa?: string
  departamento?: string
  provincia?: string
  distrito?: string
  ubigeo_sunat?: string
  ubigeo?: string[]
  es_agente_de_retencion?: string
  es_buen_contribuyente?: string
}

const TableFilters = ({ setData, tableData }: { setData: (data: ClientType[]) => void; tableData?: ClientType[] }) => {
  // States
  const [tipoDocumento, setTipoDocumento] = useState<string>('')
  const [estado, setEstado] = useState<string>('')
  const [nameFilter, setNameFilter] = useState<string>('')

  useEffect(() => {
    const filteredData = tableData?.filter(client => {
      // Filter by document type
      if (tipoDocumento && client.tipo_documento !== tipoDocumento) return false

      // Filter by status (only for RUC)
      if (estado && client.tipo_documento === 'RUC' && client.estado !== estado) return false

      // Filter by name
      if (nameFilter) {
        const searchText = nameFilter.toLowerCase()
        const clientName = client.tipo_documento === 'DNI'
          ? (client.nombre_completo || `${client.apellido_paterno} ${client.apellido_materno}, ${client.nombres}`)
          : client.nombre_o_razon_social || ''

        if (!clientName.toLowerCase().includes(searchText)) return false
      }

      return true
    })

    setData(filteredData || [])
  }, [tipoDocumento, estado, nameFilter, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={3}>
          <CustomTextField
            select
            fullWidth
            id='select-tipo-documento'
            value={tipoDocumento}
            onChange={e => setTipoDocumento(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Tipo de Documento</MenuItem>
            <MenuItem value='DNI'>DNI</MenuItem>
            <MenuItem value='RUC'>RUC</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <CustomTextField
            select
            fullWidth
            id='select-estado'
            value={estado}
            onChange={e => setEstado(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Estado</MenuItem>
            <MenuItem value='ACTIVO'>ACTIVO</MenuItem>
            <MenuItem value='INACTIVO'>INACTIVO</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            id='filter-name'
            value={nameFilter}
            onChange={e => setNameFilter(e.target.value)}
            placeholder='Filtrar por nombre o razón social'
          />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
