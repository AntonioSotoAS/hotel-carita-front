import { API_CONFIG } from '../config/api.config';

// Tipos de la API
export interface ClienteAPI {
  id: number;
  tipo_documento: 'DNI' | 'RUC';
  numero_documento: string;
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  nombre_completo?: string;
  codigo_verificacion?: string;
  nombre_o_razon_social?: string;
  estado?: string;
  condicion?: string;
  direccion?: string;
  direccion_completa?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  ubigeo_sunat?: string;
  ubigeo_reniec?: string;
  ciiu?: string;
  tipo_contribuyente?: string;
  es_agente_de_retencion?: string;
  es_buen_contribuyente?: string;
  email?: string;
  telefono?: string;
  observaciones?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion?: string;
}

export interface CrearClienteAPI {
  tipo_documento: 'DNI' | 'RUC';
  numero_documento: string;
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  nombre_completo?: string;
  codigo_verificacion?: string;
  nombre_o_razon_social?: string;
  estado?: string;
  condicion?: string;
  direccion?: string;
  direccion_completa?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  ubigeo_sunat?: string;
  ubigeo_reniec?: string;
  ciiu?: string;
  tipo_contribuyente?: string;
  es_agente_de_retencion?: string;
  es_buen_contribuyente?: string;
  email?: string;
  telefono?: string;
  observaciones?: string;
}

export interface ActualizarClienteAPI extends Partial<CrearClienteAPI> {}

export interface ClientesEstadisticasAPI {
  total_clientes: number;
  personas_naturales: number;
  empresas: number;
  porcentaje_dni: number;
  porcentaje_ruc: number;
  clientes_activos: number;
  clientes_inactivos: number;
  ultimos_clientes: ClienteAPI[];
}

export interface PaginacionResponse {
  clientes: ClienteAPI[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ClientesService {
  private baseUrl = `${API_CONFIG.BASE_URL}/clientes`;

  // Obtener token de autenticación
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Manejar errores de la API
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  // CRUD básico
  async crearCliente(cliente: CrearClienteAPI): Promise<ClienteAPI> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(cliente)
    });
    return this.handleResponse<ClienteAPI>(response);
  }

  async obtenerTodos(): Promise<ClienteAPI[]> {
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<ClienteAPI[]>(response);
  }

  async obtenerPorPaginacion(page: number = 1, limit: number = 10): Promise<PaginacionResponse> {
    const response = await fetch(`${this.baseUrl}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<PaginacionResponse>(response);
  }

  async obtenerPorId(id: number): Promise<ClienteAPI> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<ClienteAPI>(response);
  }

  async actualizarCliente(id: number, cliente: ActualizarClienteAPI): Promise<ClienteAPI> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(cliente)
    });
    return this.handleResponse<ClienteAPI>(response);
  }

  async eliminarCliente(id: number): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<{ message: string }>(response);
  }

  // Consultas específicas
  async obtenerEstadisticas(): Promise<ClientesEstadisticasAPI> {
    const response = await fetch(`${this.baseUrl}/estadisticas`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<ClientesEstadisticasAPI>(response);
  }

  async obtenerPersonasNaturales(): Promise<ClienteAPI[]> {
    const response = await fetch(`${this.baseUrl}/personas-naturales`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<ClienteAPI[]>(response);
  }

  async obtenerEmpresas(): Promise<ClienteAPI[]> {
    const response = await fetch(`${this.baseUrl}/empresas`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<ClienteAPI[]>(response);
  }

  async obtenerClientesActivos(): Promise<ClienteAPI[]> {
    const response = await fetch(`${this.baseUrl}/activos`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<ClienteAPI[]>(response);
  }

  async obtenerClientesInactivos(): Promise<ClienteAPI[]> {
    const response = await fetch(`${this.baseUrl}/inactivos`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<ClienteAPI[]>(response);
  }

  async obtenerPorTipo(tipo: 'DNI' | 'RUC'): Promise<ClienteAPI[]> {
    const response = await fetch(`${this.baseUrl}/tipo/${tipo}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<ClienteAPI[]>(response);
  }

  async obtenerPorDocumento(documento: string): Promise<ClienteAPI> {
    const response = await fetch(`${this.baseUrl}/documento/${documento}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<ClienteAPI>(response);
  }

  // Búsquedas
  async buscarPorNombre(nombre: string): Promise<ClienteAPI[]> {
    const response = await fetch(`${this.baseUrl}/buscar?nombre=${encodeURIComponent(nombre)}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<ClienteAPI[]>(response);
  }

  async buscarAvanzada(termino: string): Promise<ClienteAPI[]> {
    const response = await fetch(`${this.baseUrl}/buscar-avanzada?termino=${encodeURIComponent(termino)}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<ClienteAPI[]>(response);
  }

  // Utilidades
  async verificarDocumentoExistente(numero_documento: string): Promise<boolean> {
    try {
      await this.obtenerPorDocumento(numero_documento);
      return true; // El documento existe
    } catch (error) {
      return false; // El documento no existe
    }
  }

  // Transformar datos del frontend a la API
  transformarParaAPI(cliente: any): CrearClienteAPI {
    return {
      tipo_documento: cliente.tipo_documento,
      numero_documento: cliente.numero_documento,
      nombres: cliente.nombres,
      apellido_paterno: cliente.apellido_paterno,
      apellido_materno: cliente.apellido_materno,
      nombre_completo: cliente.nombre_completo,
      codigo_verificacion: cliente.codigo_verificacion,
      nombre_o_razon_social: cliente.nombre_o_razon_social,
      estado: cliente.estado,
      condicion: cliente.condicion,
      direccion: cliente.direccion,
      direccion_completa: cliente.direccion_completa,
      departamento: cliente.departamento,
      provincia: cliente.provincia,
      distrito: cliente.distrito,
      ubigeo_sunat: cliente.ubigeo_sunat,
      ubigeo_reniec: cliente.ubigeo_reniec,
      ciiu: cliente.ciiu,
      tipo_contribuyente: cliente.tipo_contribuyente,
      es_agente_de_retencion: cliente.es_agente_de_retencion,
      es_buen_contribuyente: cliente.es_buen_contribuyente,
      email: cliente.email,
      telefono: cliente.telefono,
      observaciones: cliente.observaciones
    };
  }

  // Transformar datos de la API al frontend
  transformarDesdeAPI(clienteAPI: ClienteAPI): any {
    return {
      id: clienteAPI.id,
      tipo_documento: clienteAPI.tipo_documento,
      numero_documento: clienteAPI.numero_documento,
      nombres: clienteAPI.nombres,
      apellido_paterno: clienteAPI.apellido_paterno,
      apellido_materno: clienteAPI.apellido_materno,
      nombre_completo: clienteAPI.nombre_completo,
      codigo_verificacion: clienteAPI.codigo_verificacion,
      nombre_o_razon_social: clienteAPI.nombre_o_razon_social,
      estado: clienteAPI.estado,
      condicion: clienteAPI.condicion,
      direccion: clienteAPI.direccion,
      direccion_completa: clienteAPI.direccion_completa,
      departamento: clienteAPI.departamento,
      provincia: clienteAPI.provincia,
      distrito: clienteAPI.distrito,
      ubigeo_sunat: clienteAPI.ubigeo_sunat,
      ubigeo_reniec: clienteAPI.ubigeo_reniec,
      ciiu: clienteAPI.ciiu,
      tipo_contribuyente: clienteAPI.tipo_contribuyente,
      es_agente_de_retencion: clienteAPI.es_agente_de_retencion,
      es_buen_contribuyente: clienteAPI.es_buen_contribuyente,
      email: clienteAPI.email,
      telefono: clienteAPI.telefono,
      observaciones: clienteAPI.observaciones,
      fechaCreacion: clienteAPI.fecha_creacion,
      fechaActualizacion: clienteAPI.fecha_actualizacion,
      fechaEliminacion: clienteAPI.fecha_eliminacion
    };
  }
}

export const clientesService = new ClientesService();
