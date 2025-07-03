// Tipos para Productos
export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  stock: number;
  precio?: number;
  sku?: string;
  categoria?: string;
  unidad?: string;
  stock_minimo: number;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaEliminacion?: string;
}

export interface CrearProductoDto {
  name: string;
  description?: string;
  stock?: number;
  price?: number;
  sku?: string;
  category?: string;
  unit?: string;
  min_stock?: number;
  is_active?: boolean;
}

export interface ActualizarProductoDto extends Partial<CrearProductoDto> {}

// Tipos para Habitaciones
export type EstadoHabitacion = 'ocupada' | 'vacia' | 'en-limpieza' | 'reservada';

export interface Habitacion {
  id: number;
  name: string;
  estado: EstadoHabitacion;
  description?: string;
  price_per_night?: number;
  room_type?: string;
  capacity: number;
  is_active: boolean;
  fecha_reserva?: string;
  hora_reserva?: string;
  fecha_check_in?: string;
  hora_check_in?: string;
  fecha_check_out?: string;
  hora_check_out?: string;
  huesped_nombre?: string;
  huesped_documento?: string;
  huesped_email?: string;
  huesped_telefono?: string;
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

export interface CrearHabitacionDto {
  name: string;
  estado?: EstadoHabitacion;
  description?: string;
  price_per_night?: number;
  room_type?: string;
  capacity?: number;
  is_active?: boolean;
}

export interface ActualizarHabitacionDto extends Partial<CrearHabitacionDto> {}

export interface CheckInDto {
  huesped_nombre: string;
  huesped_documento: string;
  huesped_email?: string;
  huesped_telefono?: string;
  observaciones?: string;
  fecha_check_in?: string;
  hora_check_in?: string;
}

export interface CheckOutDto {
  fecha_check_out?: string;
  hora_check_out?: string;
  necesita_limpieza?: boolean;
  observaciones?: string;
}

export interface ReservarHabitacionDto {
  fecha_reserva: string;
  hora_reserva: string;
  huesped_nombre: string;
  huesped_documento: string;
  huesped_email?: string;
  huesped_telefono?: string;
  observaciones?: string;
}

// Tipos para Clientes
export type TipoDocumento = 'DNI' | 'RUC';

export interface Cliente {
  id: number;
  tipo_documento: TipoDocumento;
  numero_documento: string;
  is_active: boolean;
  // Campos para DNI (Personas Naturales)
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  nombre_completo?: string;
  codigo_verificacion?: string;
  // Campos para RUC (Empresas)
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
  // Campos comunes
  email?: string;
  telefono?: string;
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

export interface CrearClienteDto {
  tipo_documento: TipoDocumento;
  numero_documento: string;
  is_active?: boolean;
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
  email?: string;
  telefono?: string;
  observaciones?: string;
}

export interface ActualizarClienteDto extends Partial<CrearClienteDto> {}

export interface ClienteEstadisticas {
  total_clientes: number;
  personas_naturales: number;
  empresas: number;
  porcentaje_dni: number;
  porcentaje_ruc: number;
}

// Tipos de respuesta de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
