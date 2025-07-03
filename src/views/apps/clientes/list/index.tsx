// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ClientListTable from './ClientListTable'
import UserListCards from './UserListCards'

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

// Datos de ejemplo
const sampleClientData: ClientType[] = [
  {
    id: 1,
    tipo_documento: 'DNI',
    numero_documento: '12345678',
    nombres: 'JUAN CARLOS',
    apellido_paterno: 'PEREZ',
    apellido_materno: 'GARCIA',
    nombre_completo: 'PEREZ GARCIA, JUAN CARLOS',
    codigo_verificacion: '5'
  },
  {
    id: 2,
    tipo_documento: 'RUC',
    numero_documento: '20100443688',
    nombre_o_razon_social: 'EMPRESA DEMO S.A.C.',
    estado: 'ACTIVO',
    condicion: 'HABIDO',
    direccion: 'JR. ANDAHUAYLAS NRO. 100 INT. 201 URB. BARRIOS ALTOS',
    direccion_completa: 'JR. ANDAHUAYLAS NRO. 100 INT. 201 URB. BARRIOS ALTOS - LIMA LIMA LIMA',
    departamento: 'LIMA',
    provincia: 'LIMA',
    distrito: 'MAGDALENA DEL MAR',
    ubigeo_sunat: '150101',
    ubigeo: ['15', '1501', '150101'],
    es_agente_de_retencion: 'NO',
    es_buen_contribuyente: 'NO'
  },
  {
    id: 3,
    tipo_documento: 'DNI',
    numero_documento: '87654321',
    nombres: 'MARIA ELENA',
    apellido_paterno: 'RODRIGUEZ',
    apellido_materno: 'LOPEZ',
    nombre_completo: 'RODRIGUEZ LOPEZ, MARIA ELENA',
    codigo_verificacion: '8'
  },
  {
    id: 4,
    tipo_documento: 'RUC',
    numero_documento: '20555123456',
    nombre_o_razon_social: 'CONSTRUCTORA LIMA S.R.L.',
    estado: 'ACTIVO',
    condicion: 'HABIDO',
    direccion: 'AV. JAVIER PRADO ESTE NRO. 456',
    direccion_completa: 'AV. JAVIER PRADO ESTE NRO. 456 - LIMA LIMA SAN ISIDRO',
    departamento: 'LIMA',
    provincia: 'LIMA',
    distrito: 'SAN ISIDRO',
    ubigeo_sunat: '150130',
    ubigeo: ['15', '1501', '150130'],
    es_agente_de_retencion: 'NO',
    es_buen_contribuyente: 'SI'
  },
  {
    id: 5,
    tipo_documento: 'RUC',
    numero_documento: '10789456123',
    nombre_o_razon_social: 'COMERCIAL NORTE E.I.R.L.',
    estado: 'INACTIVO',
    condicion: 'NO HABIDO',
    direccion: 'JR. LAMPA NRO. 789',
    direccion_completa: 'JR. LAMPA NRO. 789 - LIMA LIMA LIMA',
    departamento: 'LIMA',
    provincia: 'LIMA',
    distrito: 'LIMA',
    ubigeo_sunat: '150101',
    ubigeo: ['15', '1501', '150101'],
    es_agente_de_retencion: 'NO',
    es_buen_contribuyente: 'NO'
  }
]

const ClientList = ({ clientData }: { clientData?: ClientType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ClientListTable tableData={clientData || sampleClientData} />
      </Grid>
    </Grid>
  )
}

export default ClientList
