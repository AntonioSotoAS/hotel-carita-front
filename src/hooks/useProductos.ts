import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Importar tipos del backend
import type { Producto, CrearProductoDto, ActualizarProductoDto } from '@/types/backend.types';

// Datos estáticos de productos
const productosIniciales: Producto[] = [
  {
    id: 1,
    nombre: 'Laptop HP Pavilion',
    descripcion: 'Laptop de alto rendimiento con procesador Intel i7',
    stock: 15,
    precio: 2500.00,
    sku: 'HP-PAV-001',
    categoria: 'Electrónicos',
    unidad: 'unidades',
    stock_minimo: 5,
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: 2,
    nombre: 'Mouse Inalámbrico Logitech',
    descripcion: 'Mouse ergonómico con tecnología inalámbrica',
    stock: 3,
    precio: 85.00,
    sku: 'LOG-MS-002',
    categoria: 'Accesorios',
    unidad: 'unidades',
    stock_minimo: 10,
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: 3,
    nombre: 'Teclado Mecánico RGB',
    descripcion: 'Teclado gaming con iluminación RGB',
    stock: 0,
    precio: 220.00,
    sku: 'RGB-KB-003',
    categoria: 'Accesorios',
    unidad: 'unidades',
    stock_minimo: 8,
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: 4,
    nombre: 'Monitor 24" Full HD',
    descripcion: 'Monitor LED de 24 pulgadas resolución 1920x1080',
    stock: 12,
    precio: 450.00,
    sku: 'MON-24-004',
    categoria: 'Monitores',
    unidad: 'unidades',
    stock_minimo: 6,
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: 5,
    nombre: 'Webcam HD 1080p',
    descripcion: 'Cámara web con calidad Full HD para videoconferencias',
    stock: 25,
    precio: 120.00,
    sku: 'WEB-HD-005',
    categoria: 'Accesorios',
    unidad: 'unidades',
    stock_minimo: 15,
    activo: true,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  }
];

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los productos (simple)
  const cargarProductos = () => {
    setProductos(productosIniciales);
  };

    // Crear producto (simple)
  const crearProducto = (producto: CrearProductoDto): boolean => {
    const nuevoProducto: Producto = {
      id: Date.now(), // ID único basado en timestamp
      nombre: producto.name,
      descripcion: producto.description,
      stock: producto.stock || 0,
      precio: producto.price,
      sku: producto.sku,
      categoria: producto.category,
      unidad: producto.unit || 'unidades',
      stock_minimo: producto.min_stock || 5,
      activo: producto.is_active !== false,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    setProductos(prev => [nuevoProducto, ...prev]);
    toast.success('Producto creado exitosamente');
    return true;
  };

  // Actualizar producto (simulado)
  const actualizarProducto = async (id: number, producto: ActualizarProductoDto): Promise<boolean> => {
    setLoading(true);

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 600));

    setProductos(prev => prev.map(p =>
      p.id === id ? { ...p, ...producto } : p
    ));
    toast.success('Producto actualizado exitosamente');
    setLoading(false);
    return true;
  };

  // Eliminar producto (simulado)
  const eliminarProducto = async (id: number): Promise<boolean> => {
    setLoading(true);

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 400));

    setProductos(prev => prev.filter(p => p.id !== id));
    toast.success('Producto eliminado exitosamente');
    setLoading(false);
    return true;
  };

  // Actualizar stock (simulado)
  const actualizarStock = async (id: number, nuevoStock: number): Promise<boolean> => {
    setLoading(true);

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    setProductos(prev => prev.map(p =>
      p.id === id ? { ...p, stock: nuevoStock } : p
    ));
    toast.success('Stock actualizado exitosamente');
    setLoading(false);
    return true;
  };

  // Obtener productos con bajo stock (simulado)
  const obtenerConBajoStock = async (): Promise<Producto[]> => {
    return productos.filter(p => p.stock <= p.stock_minimo);
  };

  // Efecto para cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  return {
    productos,
    loading,
    error,
    cargarProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    actualizarStock,
    obtenerConBajoStock,
  };
};
