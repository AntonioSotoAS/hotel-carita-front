import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { clientesService } from '../services';
import {
  Cliente,
  CrearClienteDto,
  ActualizarClienteDto,
  TipoDocumento,
  ClienteEstadisticas
} from '../types/backend.types';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los clientes
  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientesService.obtenerTodos();
      setClientes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar clientes');
      toast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  // Crear cliente
  const crearCliente = async (cliente: CrearClienteDto): Promise<boolean> => {
    try {
      setLoading(true);
      const nuevoCliente = await clientesService.crear(cliente);
      setClientes(prev => [nuevoCliente, ...prev]);
      toast.success('Cliente creado exitosamente');
      return true;
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al crear cliente';
      setError(mensaje);
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cliente
  const actualizarCliente = async (id: number, cliente: ActualizarClienteDto): Promise<boolean> => {
    try {
      setLoading(true);
      const clienteActualizado = await clientesService.actualizar(id, cliente);
      setClientes(prev => prev.map(c => c.id === id ? clienteActualizado : c));
      toast.success('Cliente actualizado exitosamente');
      return true;
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al actualizar cliente';
      setError(mensaje);
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar cliente
  const eliminarCliente = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      await clientesService.eliminar(id);
      setClientes(prev => prev.filter(c => c.id !== id));
      toast.success('Cliente eliminado exitosamente');
      return true;
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al eliminar cliente';
      setError(mensaje);
      toast.error(mensaje);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Buscar cliente por documento
  const buscarPorDocumento = async (numeroDocumento: string): Promise<Cliente | null> => {
    try {
      return await clientesService.obtenerPorDocumento(numeroDocumento);
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Cliente no encontrado';
      setError(mensaje);
      toast.error(mensaje);
      return null;
    }
  };

  // Buscar clientes por nombre
  const buscarPorNombre = async (nombre: string): Promise<Cliente[]> => {
    try {
      return await clientesService.buscarPorNombre(nombre);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la búsqueda');
      toast.error('Error en la búsqueda');
      return [];
    }
  };

  // Obtener estadísticas
  const obtenerEstadisticas = async (): Promise<ClienteEstadisticas | null> => {
    try {
      return await clientesService.obtenerEstadisticas();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener estadísticas');
      toast.error('Error al obtener estadísticas');
      return null;
    }
  };

  // Obtener personas naturales
  const obtenerPersonasNaturales = async (): Promise<Cliente[]> => {
    try {
      return await clientesService.obtenerPersonasNaturales();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener personas naturales');
      toast.error('Error al obtener personas naturales');
      return [];
    }
  };

  // Obtener empresas
  const obtenerEmpresas = async (): Promise<Cliente[]> => {
    try {
      return await clientesService.obtenerEmpresas();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener empresas');
      toast.error('Error al obtener empresas');
      return [];
    }
  };

  // Obtener clientes por tipo
  const obtenerPorTipo = async (tipo: TipoDocumento): Promise<Cliente[]> => {
    try {
      return await clientesService.obtenerPorTipo(tipo);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener clientes por tipo');
      toast.error('Error al obtener clientes por tipo');
      return [];
    }
  };

  // Efecto para cargar clientes al montar el componente
  useEffect(() => {
    cargarClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    cargarClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    buscarPorDocumento,
    buscarPorNombre,
    obtenerEstadisticas,
    obtenerPersonasNaturales,
    obtenerEmpresas,
    obtenerPorTipo,
  };
};
