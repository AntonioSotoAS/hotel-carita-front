import apiClient from './api.config';
import {
  Cliente,
  CrearClienteDto,
  ActualizarClienteDto,
  TipoDocumento,
  ClienteEstadisticas
} from '../types/backend.types';

export class ClientesService {
  private readonly baseUrl = '/clientes';

  // Obtener todos los clientes
  async obtenerTodos(): Promise<Cliente[]> {
    const response = await apiClient.get<Cliente[]>(this.baseUrl);
    return response.data;
  }

  // Obtener cliente por ID
  async obtenerPorId(id: number): Promise<Cliente> {
    const response = await apiClient.get<Cliente>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Obtener cliente por documento
  async obtenerPorDocumento(numeroDocumento: string): Promise<Cliente> {
    const response = await apiClient.get<Cliente>(`${this.baseUrl}/documento/${numeroDocumento}`);
    return response.data;
  }

  // Crear nuevo cliente
  async crear(cliente: CrearClienteDto): Promise<Cliente> {
    const response = await apiClient.post<Cliente>(this.baseUrl, cliente);
    return response.data;
  }

  // Actualizar cliente
  async actualizar(id: number, cliente: ActualizarClienteDto): Promise<Cliente> {
    const response = await apiClient.patch<Cliente>(`${this.baseUrl}/${id}`, cliente);
    return response.data;
  }

  // Eliminar cliente
  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  // Obtener estadísticas de clientes
  async obtenerEstadisticas(): Promise<ClienteEstadisticas> {
    const response = await apiClient.get<ClienteEstadisticas>(`${this.baseUrl}/estadisticas`);
    return response.data;
  }

  // Obtener personas naturales (DNI)
  async obtenerPersonasNaturales(): Promise<Cliente[]> {
    const response = await apiClient.get<Cliente[]>(`${this.baseUrl}/personas-naturales`);
    return response.data;
  }

  // Obtener empresas (RUC)
  async obtenerEmpresas(): Promise<Cliente[]> {
    const response = await apiClient.get<Cliente[]>(`${this.baseUrl}/empresas`);
    return response.data;
  }

  // Obtener clientes por tipo de documento
  async obtenerPorTipo(tipo: TipoDocumento): Promise<Cliente[]> {
    const response = await apiClient.get<Cliente[]>(`${this.baseUrl}/tipo/${tipo}`);
    return response.data;
  }

  // Buscar clientes por nombre
  async buscarPorNombre(nombre: string): Promise<Cliente[]> {
    const response = await apiClient.get<Cliente[]>(`${this.baseUrl}/buscar`, {
      params: { nombre }
    });
    return response.data;
  }
}

// Instancia singleton del servicio
export const clientesService = new ClientesService();
