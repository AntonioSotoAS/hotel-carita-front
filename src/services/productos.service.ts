import apiClient from './api.config';
import { Producto, CrearProductoDto, ActualizarProductoDto } from '../types/backend.types';

export class ProductosService {
  private readonly baseUrl = '/productos';

  // Obtener todos los productos
  async obtenerTodos(): Promise<Producto[]> {
    const response = await apiClient.get<Producto[]>(this.baseUrl);
    return response.data;
  }

  // Obtener producto por ID
  async obtenerPorId(id: number): Promise<Producto> {
    const response = await apiClient.get<Producto>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Crear nuevo producto
  async crear(producto: CrearProductoDto): Promise<Producto> {
    const response = await apiClient.post<Producto>(this.baseUrl, producto);
    return response.data;
  }

  // Actualizar producto
  async actualizar(id: number, producto: ActualizarProductoDto): Promise<Producto> {
    const response = await apiClient.patch<Producto>(`${this.baseUrl}/${id}`, producto);
    return response.data;
  }

  // Eliminar producto
  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  // Obtener productos con bajo stock
  async obtenerConBajoStock(): Promise<Producto[]> {
    const response = await apiClient.get<Producto[]>(`${this.baseUrl}/bajo-stock`);
    return response.data;
  }

  // Obtener productos por categoría
  async obtenerPorCategoria(categoria: string): Promise<Producto[]> {
    const response = await apiClient.get<Producto[]>(`${this.baseUrl}/categoria/${categoria}`);
    return response.data;
  }

  // Actualizar stock de un producto
  async actualizarStock(id: number, nuevoStock: number): Promise<Producto> {
    const response = await apiClient.patch<Producto>(`${this.baseUrl}/${id}/stock`, { stock: nuevoStock });
    return response.data;
  }
}

// Instancia singleton del servicio
export const productosService = new ProductosService();
