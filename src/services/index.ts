// Exportar configuración de API
export { default as apiClient } from './api.config';

// Exportar servicios
export { productosService, ProductosService } from './productos.service';
export { habitacionesService, HabitacionesService } from './habitaciones.service';
export { clientesService, ClientesService } from './clientes.service';

// Exportar tipos
export * from '../types/backend.types';
