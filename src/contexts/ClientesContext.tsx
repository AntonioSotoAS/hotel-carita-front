'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Types
interface Cliente {
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

  // Timestamps
  fechaCreacion?: string
  fechaActualizacion?: string
  fechaEliminacion?: string
}

interface ClientesContextType {
  clientes: Cliente[]
  isLoading: boolean

  // Funciones CRUD
  agregarCliente: (cliente: Omit<Cliente, 'id' | 'fechaCreacion'>) => void
  actualizarCliente: (id: number, cliente: Partial<Cliente>) => void
  eliminarCliente: (id: number) => void
  obtenerClientePorId: (id: number) => Cliente | undefined

  // Funciones de utilidad
  obtenerClientesPorTipo: (tipo: 'DNI' | 'RUC') => Cliente[]
  obtenerClientesActivos: () => Cliente[]
  obtenerClientesInactivos: () => Cliente[]
  obtenerEstadisticas: () => ClientesEstadisticas
  buscarClientes: (termino: string) => Cliente[]

  // Funciones de localStorage
  exportarDatos: () => string
  importarDatos: (datos: string) => boolean
  limpiarDatos: () => void
}

interface ClientesEstadisticas {
  totalClientes: number
  clientesDNI: number
  clientesRUC: number
  clientesActivos: number
  clientesInactivos: number
  ultimosClientes: Cliente[]
}

const ClientesContext = createContext<ClientesContextType | undefined>(undefined)

// Clave para localStorage
const CLIENTES_STORAGE_KEY = 'clientes_data'

// Funciones de localStorage
const guardarEnStorage = (clientes: Cliente[]) => {
  try {
    localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify(clientes))
  } catch (error) {
    console.error('Error al guardar clientes en localStorage:', error)
  }
}

const cargarDesdeStorage = (): Cliente[] => {
  try {
    const data = localStorage.getItem(CLIENTES_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error al cargar clientes desde localStorage:', error)
    return []
  }
}

// Datos iniciales para clientes (si no hay datos en localStorage)
const clientesIniciales: Cliente[] = [
  {
    id: 1,
    tipo_documento: 'DNI',
    numero_documento: '12345678',
    nombres: 'Juan',
    apellido_paterno: 'Pérez',
    apellido_materno: 'García',
    nombre_completo: 'Pérez García, Juan',
    codigo_verificacion: '1',
    fechaCreacion: new Date().toISOString()
  },
  {
    id: 2,
    tipo_documento: 'RUC',
    numero_documento: '20123456789',
    nombre_o_razon_social: 'EMPRESA DEMO S.A.C.',
    estado: 'ACTIVO',
    condicion: 'HABIDO',
    direccion: 'JR. ANDAHUAYLAS NRO. 100 INT. 201',
    direccion_completa: 'JR. ANDAHUAYLAS NRO. 100 INT. 201 - MAGDALENA DEL MAR',
    departamento: 'LIMA',
    provincia: 'LIMA',
    distrito: 'MAGDALENA DEL MAR',
    ubigeo_sunat: '150101',
    es_agente_de_retencion: 'NO',
    es_buen_contribuyente: 'NO',
    fechaCreacion: new Date().toISOString()
  }
]

interface ClientesProviderProps {
  children: ReactNode
}

export const ClientesProvider = ({ children }: ClientesProviderProps) => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargar clientes al inicializar
  useEffect(() => {
    const clientesGuardados = cargarDesdeStorage()
    if (clientesGuardados.length > 0) {
      setClientes(clientesGuardados)
    } else {
      // Si no hay datos guardados, usar datos iniciales
      setClientes(clientesIniciales)
      guardarEnStorage(clientesIniciales)
    }
    setIsLoading(false)
  }, [])

  // Guardar clientes cuando cambie
  useEffect(() => {
    if (!isLoading && clientes.length > 0) {
      guardarEnStorage(clientes)
    }
  }, [clientes, isLoading])

  // Funciones CRUD
  const agregarCliente = (nuevoCliente: Omit<Cliente, 'id' | 'fechaCreacion'>) => {
    const maxId = clientes.reduce((max, cliente) => Math.max(max, cliente.id), 0)
    const cliente: Cliente = {
      ...nuevoCliente,
      id: maxId + 1,
      fechaCreacion: new Date().toISOString()
    }

    setClientes(prev => [...prev, cliente])
  }

  const actualizarCliente = (id: number, clienteActualizado: Partial<Cliente>) => {
    setClientes(prev => prev.map(cliente =>
      cliente.id === id
        ? { ...cliente, ...clienteActualizado, fechaActualizacion: new Date().toISOString() }
        : cliente
    ))
  }

  const eliminarCliente = (id: number) => {
    setClientes(prev => prev.filter(cliente => cliente.id !== id))
  }

  const obtenerClientePorId = (id: number): Cliente | undefined => {
    return clientes.find(cliente => cliente.id === id)
  }

  // Funciones de utilidad
  const obtenerClientesPorTipo = (tipo: 'DNI' | 'RUC'): Cliente[] => {
    return clientes.filter(cliente => cliente.tipo_documento === tipo)
  }

  const obtenerClientesActivos = (): Cliente[] => {
    return clientes.filter(cliente =>
      cliente.tipo_documento === 'DNI' ||
      (cliente.tipo_documento === 'RUC' && cliente.estado === 'ACTIVO')
    )
  }

  const obtenerClientesInactivos = (): Cliente[] => {
    return clientes.filter(cliente =>
      cliente.tipo_documento === 'RUC' && cliente.estado === 'INACTIVO'
    )
  }

  const obtenerEstadisticas = (): ClientesEstadisticas => {
    const clientesDNI = clientes.filter(c => c.tipo_documento === 'DNI').length
    const clientesRUC = clientes.filter(c => c.tipo_documento === 'RUC').length
    const clientesActivos = obtenerClientesActivos().length
    const clientesInactivos = obtenerClientesInactivos().length

    const ultimosClientes = clientes
      .sort((a, b) => new Date(b.fechaCreacion || '').getTime() - new Date(a.fechaCreacion || '').getTime())
      .slice(0, 5)

    return {
      totalClientes: clientes.length,
      clientesDNI,
      clientesRUC,
      clientesActivos,
      clientesInactivos,
      ultimosClientes
    }
  }

  const buscarClientes = (termino: string): Cliente[] => {
    const terminoLower = termino.toLowerCase()
    return clientes.filter(cliente =>
      cliente.numero_documento.toLowerCase().includes(terminoLower) ||
      cliente.nombres?.toLowerCase().includes(terminoLower) ||
      cliente.apellido_paterno?.toLowerCase().includes(terminoLower) ||
      cliente.apellido_materno?.toLowerCase().includes(terminoLower) ||
      cliente.nombre_completo?.toLowerCase().includes(terminoLower) ||
      cliente.nombre_o_razon_social?.toLowerCase().includes(terminoLower) ||
      cliente.direccion?.toLowerCase().includes(terminoLower) ||
      cliente.distrito?.toLowerCase().includes(terminoLower) ||
      cliente.provincia?.toLowerCase().includes(terminoLower) ||
      cliente.departamento?.toLowerCase().includes(terminoLower)
    )
  }

  // Funciones de localStorage
  const exportarDatos = (): string => {
    return JSON.stringify(clientes, null, 2)
  }

  const importarDatos = (datos: string): boolean => {
    try {
      const clientesImportados = JSON.parse(datos) as Cliente[]

      // Validar que sean clientes válidos
      const clientesValidos = clientesImportados.filter(cliente =>
        cliente.id && cliente.numero_documento && cliente.tipo_documento
      )

      if (clientesValidos.length > 0) {
        setClientes(clientesValidos)
        return true
      }

      return false
    } catch (error) {
      console.error('Error al importar clientes:', error)
      return false
    }
  }

  const limpiarDatos = () => {
    setClientes([])
    localStorage.removeItem(CLIENTES_STORAGE_KEY)
  }

  const value: ClientesContextType = {
    clientes,
    isLoading,
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerClientePorId,
    obtenerClientesPorTipo,
    obtenerClientesActivos,
    obtenerClientesInactivos,
    obtenerEstadisticas,
    buscarClientes,
    exportarDatos,
    importarDatos,
    limpiarDatos
  }

  return (
    <ClientesContext.Provider value={value}>
      {children}
    </ClientesContext.Provider>
  )
}

// Hook para usar el contexto
export const useClientes = () => {
  const context = useContext(ClientesContext)
  if (context === undefined) {
    throw new Error('useClientes debe ser usado dentro de un ClientesProvider')
  }
  return context
}

// Hooks específicos para diferentes operaciones
export const useClientesEstadisticas = () => {
  const { obtenerEstadisticas } = useClientes()
  return obtenerEstadisticas()
}

export const useClientesPorTipo = (tipo: 'DNI' | 'RUC') => {
  const { obtenerClientesPorTipo } = useClientes()
  return obtenerClientesPorTipo(tipo)
}

export const useBuscarClientes = (termino: string) => {
  const { buscarClientes } = useClientes()
  return buscarClientes(termino)
}

// Exportar tipo Cliente para uso en otros archivos
export type { Cliente }
