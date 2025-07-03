import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { habitacionesService } from '../services';
import {
  Habitacion,
  CrearHabitacionDto,
  ActualizarHabitacionDto,
  CheckInDto,
  CheckOutDto,
  ReservarHabitacionDto,
  EstadoHabitacion
} from '../types/backend.types';

export const useHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todas las habitaciones
  const cargarHabitaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await habitacionesService.obtenerTodas();
      setHabitaciones(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar habitaciones');
      toast.error('Error al cargar habitaciones');
    } finally {
      setLoading(false);
    }
  };

  // Crear habitación
  const crearHabitacion = async (habitacion: CrearHabitacionDto): Promise<boolean> => {
    try {
      setLoading(true);
      const nuevaHabitacion = await habitacionesService.crear(habitacion);
      setHabitaciones(prev => [nuevaHabitacion, ...prev]);
      toast.success('Habitación creada exitosamente');
      return true;
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al crear habitación';
      setError(mensaje);
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar habitación
  const actualizarHabitacion = async (id: number, habitacion: ActualizarHabitacionDto): Promise<boolean> => {
    try {
      setLoading(true);
      const habitacionActualizada = await habitacionesService.actualizar(id, habitacion);
      setHabitaciones(prev => prev.map(h => h.id === id ? habitacionActualizada : h));
      toast.success('Habitación actualizada exitosamente');
      return true;
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al actualizar habitación';
      setError(mensaje);
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar habitación
  const eliminarHabitacion = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      await habitacionesService.eliminar(id);
      setHabitaciones(prev => prev.filter(h => h.id !== id));
      toast.success('Habitación eliminada exitosamente');
      return true;
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al eliminar habitación';
      setError(mensaje);
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado de habitación
  const cambiarEstado = async (id: number, nuevoEstado: EstadoHabitacion): Promise<boolean> => {
    try {
      setLoading(true);
      const habitacionActualizada = await habitacionesService.cambiarEstado(id, nuevoEstado);
      setHabitaciones(prev => prev.map(h => h.id === id ? habitacionActualizada : h));
      toast.success('Estado de habitación actualizado');
      return true;
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al cambiar estado';
      setError(mensaje);
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reservar habitación
  const reservarHabitacion = async (id: number, reserva: ReservarHabitacionDto): Promise<boolean> => {
    try {
      setLoading(true);
      const habitacionReservada = await habitacionesService.reservar(id, reserva);
      setHabitaciones(prev => prev.map(h => h.id === id ? habitacionReservada : h));
      toast.success('Habitación reservada exitosamente');
      return true;
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al reservar habitación';
      setError(mensaje);
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Hacer check-in
  const hacerCheckIn = async (id: number, checkInData: CheckInDto): Promise<boolean> => {
    try {
      setLoading(true);
      const habitacionCheckIn = await habitacionesService.checkIn(id, checkInData);
      setHabitaciones(prev => prev.map(h => h.id === id ? habitacionCheckIn : h));
      toast.success('Check-in realizado exitosamente');
      return true;
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al hacer check-in';
      setError(mensaje);
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Hacer check-out
  const hacerCheckOut = async (id: number, checkOutData: CheckOutDto): Promise<boolean> => {
    try {
      setLoading(true);
      const habitacionCheckOut = await habitacionesService.checkOut(id, checkOutData);
      setHabitaciones(prev => prev.map(h => h.id === id ? habitacionCheckOut : h));
      toast.success('Check-out realizado exitosamente');
      return true;
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al hacer check-out';
      setError(mensaje);
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Finalizar limpieza
  const finalizarLimpieza = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      const habitacionLimpia = await habitacionesService.finalizarLimpieza(id);
      setHabitaciones(prev => prev.map(h => h.id === id ? habitacionLimpia : h));
      toast.success('Limpieza finalizada exitosamente');
      return true;
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al finalizar limpieza';
      setError(mensaje);
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Obtener habitaciones por estado
  const obtenerPorEstado = async (estado: EstadoHabitacion): Promise<Habitacion[]> => {
    try {
      return await habitacionesService.obtenerPorEstado(estado);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener habitaciones por estado');
      toast.error('Error al obtener habitaciones por estado');
      return [];
    }
  };

  // Efecto para cargar habitaciones al montar el componente
  useEffect(() => {
    cargarHabitaciones();
  }, []);

  return {
    habitaciones,
    loading,
    error,
    cargarHabitaciones,
    crearHabitacion,
    actualizarHabitacion,
    eliminarHabitacion,
    cambiarEstado,
    reservarHabitacion,
    hacerCheckIn,
    hacerCheckOut,
    finalizarLimpieza,
    obtenerPorEstado,
  };
};
