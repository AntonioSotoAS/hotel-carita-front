import apiClient from './api.config';
import {
  Habitacion,
  CrearHabitacionDto,
  ActualizarHabitacionDto,
  CheckInDto,
  CheckOutDto,
  ReservarHabitacionDto,
  EstadoHabitacion
} from '../types/backend.types';

export class HabitacionesService {
  private readonly baseUrl = '/habitaciones';

  // Obtener todas las habitaciones
  async obtenerTodas(): Promise<Habitacion[]> {
    const response = await apiClient.get<Habitacion[]>(this.baseUrl);
    return response.data;
  }

  // Obtener habitación por ID
  async obtenerPorId(id: number): Promise<Habitacion> {
    const response = await apiClient.get<Habitacion>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Crear nueva habitación
  async crear(habitacion: CrearHabitacionDto): Promise<Habitacion> {
    const response = await apiClient.post<Habitacion>(this.baseUrl, habitacion);
    return response.data;
  }

  // Actualizar habitación
  async actualizar(id: number, habitacion: ActualizarHabitacionDto): Promise<Habitacion> {
    const response = await apiClient.patch<Habitacion>(`${this.baseUrl}/${id}`, habitacion);
    return response.data;
  }

  // Eliminar habitación
  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  // Obtener habitaciones disponibles
  async obtenerDisponibles(): Promise<Habitacion[]> {
    const response = await apiClient.get<Habitacion[]>(`${this.baseUrl}/disponibles`);
    return response.data;
  }

  // Obtener habitaciones reservadas
  async obtenerReservadas(): Promise<Habitacion[]> {
    const response = await apiClient.get<Habitacion[]>(`${this.baseUrl}/reservadas`);
    return response.data;
  }

  // Obtener habitaciones ocupadas
  async obtenerOcupadas(): Promise<Habitacion[]> {
    const response = await apiClient.get<Habitacion[]>(`${this.baseUrl}/ocupadas`);
    return response.data;
  }

  // Obtener habitaciones en limpieza
  async obtenerEnLimpieza(): Promise<Habitacion[]> {
    const response = await apiClient.get<Habitacion[]>(`${this.baseUrl}/en-limpieza`);
    return response.data;
  }

  // Obtener habitaciones por estado
  async obtenerPorEstado(estado: EstadoHabitacion): Promise<Habitacion[]> {
    const response = await apiClient.get<Habitacion[]>(`${this.baseUrl}/estado/${estado}`);
    return response.data;
  }

  // Cambiar estado de habitación
  async cambiarEstado(id: number, nuevoEstado: EstadoHabitacion): Promise<Habitacion> {
    const response = await apiClient.patch<Habitacion>(`${this.baseUrl}/${id}/estado`, { estado: nuevoEstado });
    return response.data;
  }

  // Reservar habitación
  async reservar(id: number, reserva: ReservarHabitacionDto): Promise<Habitacion> {
    const response = await apiClient.post<Habitacion>(`${this.baseUrl}/${id}/reservar`, reserva);
    return response.data;
  }

  // Hacer check-in
  async checkIn(id: number, checkInData: CheckInDto): Promise<Habitacion> {
    const response = await apiClient.post<Habitacion>(`${this.baseUrl}/${id}/check-in`, checkInData);
    return response.data;
  }

  // Hacer check-out
  async checkOut(id: number, checkOutData: CheckOutDto): Promise<Habitacion> {
    const response = await apiClient.post<Habitacion>(`${this.baseUrl}/${id}/check-out`, checkOutData);
    return response.data;
  }

  // Finalizar limpieza
  async finalizarLimpieza(id: number): Promise<Habitacion> {
    const response = await apiClient.post<Habitacion>(`${this.baseUrl}/${id}/finalizar-limpieza`);
    return response.data;
  }
}

// Instancia singleton del servicio
export const habitacionesService = new HabitacionesService();
