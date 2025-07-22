import { useState, useEffect, useCallback } from 'react';
import { clientesService, ClienteAPI, CrearClienteAPI, ActualizarClienteAPI, ClientesEstadisticasAPI, PaginacionResponse } from '../services/clientes.service';

export const useClientesAPI = () => {
  const [clientes, setClientes] = useState<ClienteAPI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los clientes
  const obtenerTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientesService.obtenerTodos();
      setClientes(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener clientes';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener clientes con paginación
  const obtenerPorPaginacion = useCallback(async (page: number = 1, limit: number = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientesService.obtenerPorPaginacion(page, limit);
      setClientes(data.clientes);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener clientes';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener cliente por ID
  const obtenerPorId = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientesService.obtenerPorId(id);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener cliente';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Crear cliente
  const crearCliente = useCallback(async (cliente: CrearClienteAPI) => {
    setIsLoading(true);
    setError(null);
    try {
      const nuevoCliente = await clientesService.crearCliente(cliente);
      setClientes(prev => [nuevoCliente, ...prev]);
      return nuevoCliente;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear cliente';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar cliente
  const actualizarCliente = useCallback(async (id: number, cliente: ActualizarClienteAPI) => {
    setIsLoading(true);
    setError(null);
    try {
      const clienteActualizado = await clientesService.actualizarCliente(id, cliente);
      setClientes(prev => prev.map(c => c.id === id ? clienteActualizado : c));
      return clienteActualizado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar cliente';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Eliminar cliente
  const eliminarCliente = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await clientesService.eliminarCliente(id);
      setClientes(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar cliente';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener estadísticas
  const obtenerEstadisticas = useCallback(async (): Promise<ClientesEstadisticasAPI> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientesService.obtenerEstadisticas();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener estadísticas';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener personas naturales
  const obtenerPersonasNaturales = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientesService.obtenerPersonasNaturales();
      setClientes(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener personas naturales';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener empresas
  const obtenerEmpresas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientesService.obtenerEmpresas();
      setClientes(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener empresas';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener clientes activos
  const obtenerClientesActivos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientesService.obtenerClientesActivos();
      setClientes(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener clientes activos';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener clientes inactivos
  const obtenerClientesInactivos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientesService.obtenerClientesInactivos();
      setClientes(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener clientes inactivos';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener por tipo
  const obtenerPorTipo = useCallback(async (tipo: 'DNI' | 'RUC') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientesService.obtenerPorTipo(tipo);
      setClientes(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener clientes por tipo';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar por nombre
  const buscarPorNombre = useCallback(async (nombre: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientesService.buscarPorNombre(nombre);
      setClientes(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al buscar clientes';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Búsqueda avanzada
  const buscarAvanzada = useCallback(async (termino: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientesService.buscarAvanzada(termino);
      setClientes(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en búsqueda avanzada';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verificar documento existente
  const verificarDocumentoExistente = useCallback(async (numero_documento: string) => {
    try {
      return await clientesService.verificarDocumentoExistente(numero_documento);
    } catch (err) {
      return false;
    }
  }, []);

  // Limpiar error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    clientes,
    isLoading,
    error,
    obtenerTodos,
    obtenerPorPaginacion,
    obtenerPorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerEstadisticas,
    obtenerPersonasNaturales,
    obtenerEmpresas,
    obtenerClientesActivos,
    obtenerClientesInactivos,
    obtenerPorTipo,
    buscarPorNombre,
    buscarAvanzada,
    verificarDocumentoExistente,
    limpiarError
  };
};
