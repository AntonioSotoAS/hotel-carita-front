'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Producto } from '@/types/backend.types'

interface ProductosContextType {
  productos: Producto[]
  isLoading: boolean

  // Funciones CRUD
  agregarProducto: (producto: Omit<Producto, 'id'>) => void
  actualizarProducto: (id: number, producto: Partial<Producto>) => void
  eliminarProducto: (id: number) => void
  obtenerProductoPorId: (id: number) => Producto | undefined

  // Funciones de utilidad
  obtenerProductosPorCategoria: (categoria: string) => Producto[]
  obtenerProductosBajoStock: () => Producto[]
  obtenerEstadisticas: () => ProductosEstadisticas
  buscarProductos: (termino: string) => Producto[]

  // Funciones de localStorage
  exportarDatos: () => string
  importarDatos: (datos: string) => boolean
  limpiarDatos: () => void
}

interface ProductosEstadisticas {
  totalProductos: number
  productosActivos: number
  productosInactivos: number
  productosBajoStock: number
  valorTotalInventario: number
  categorias: Record<string, number>
}

const ProductosContext = createContext<ProductosContextType | undefined>(undefined)

// Clave para localStorage
const PRODUCTOS_STORAGE_KEY = 'productos_data'

// Funciones de localStorage
const guardarEnStorage = (productos: Producto[]) => {
  try {
    localStorage.setItem(PRODUCTOS_STORAGE_KEY, JSON.stringify(productos))
  } catch (error) {
    console.error('Error al guardar productos en localStorage:', error)
  }
}

const cargarDesdeStorage = (): Producto[] => {
  try {
    const data = localStorage.getItem(PRODUCTOS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error al cargar productos desde localStorage:', error)
    return []
  }
}

interface ProductosProviderProps {
  children: ReactNode
}

export const ProductosProvider = ({ children }: ProductosProviderProps) => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargar productos al inicializar
  useEffect(() => {
    const productosGuardados = cargarDesdeStorage()
    setProductos(productosGuardados)
    setIsLoading(false)
  }, [])

  // Guardar productos cuando cambien
  useEffect(() => {
    if (!isLoading) {
      guardarEnStorage(productos)
    }
  }, [productos, isLoading])

  // Funciones CRUD
  const agregarProducto = (nuevoProducto: Omit<Producto, 'id'>) => {
    const maxId = productos.reduce((max, producto) => Math.max(max, producto.id), 0)
    const producto: Producto = {
      ...nuevoProducto,
      id: maxId + 1,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    }

    setProductos(prev => [...prev, producto])
  }

  const actualizarProducto = (id: number, productoActualizado: Partial<Producto>) => {
    setProductos(prev => prev.map(producto =>
      producto.id === id
        ? { ...producto, ...productoActualizado, fechaActualizacion: new Date().toISOString() }
        : producto
    ))
  }

  const eliminarProducto = (id: number) => {
    setProductos(prev => prev.map(producto =>
      producto.id === id
        ? { ...producto, activo: false, fechaEliminacion: new Date().toISOString() }
        : producto
    ))
  }

  const obtenerProductoPorId = (id: number): Producto | undefined => {
    return productos.find(producto => producto.id === id)
  }

  // Funciones de utilidad
  const obtenerProductosPorCategoria = (categoria: string): Producto[] => {
    return productos.filter(producto =>
      producto.categoria?.toLowerCase() === categoria.toLowerCase() && producto.activo
    )
  }

  const obtenerProductosBajoStock = (): Producto[] => {
    return productos.filter(producto =>
      producto.activo && producto.stock <= producto.stock_minimo
    )
  }

  const obtenerEstadisticas = (): ProductosEstadisticas => {
    const productosActivos = productos.filter(p => p.activo)
    const productosInactivos = productos.filter(p => !p.activo)
    const productosBajoStock = obtenerProductosBajoStock()

    const valorTotalInventario = productosActivos.reduce((total, producto) => {
      return total + (producto.precio || 0) * producto.stock
    }, 0)

    const categorias = productosActivos.reduce((acc, producto) => {
      const categoria = producto.categoria || 'Sin categoría'
      acc[categoria] = (acc[categoria] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalProductos: productos.length,
      productosActivos: productosActivos.length,
      productosInactivos: productosInactivos.length,
      productosBajoStock: productosBajoStock.length,
      valorTotalInventario,
      categorias
    }
  }

  const buscarProductos = (termino: string): Producto[] => {
    const terminoLower = termino.toLowerCase()
    return productos.filter(producto =>
      producto.activo && (
        producto.nombre.toLowerCase().includes(terminoLower) ||
        producto.descripcion?.toLowerCase().includes(terminoLower) ||
        producto.sku?.toLowerCase().includes(terminoLower) ||
        producto.categoria?.toLowerCase().includes(terminoLower)
      )
    )
  }

  // Funciones de localStorage
  const exportarDatos = (): string => {
    return JSON.stringify(productos, null, 2)
  }

  const importarDatos = (datos: string): boolean => {
    try {
      const productosImportados = JSON.parse(datos) as Producto[]

      // Validar que sean productos válidos
      const productosValidos = productosImportados.filter(producto =>
        producto.id && producto.nombre && typeof producto.stock === 'number'
      )

      if (productosValidos.length > 0) {
        setProductos(productosValidos)
        return true
      }

      return false
    } catch (error) {
      console.error('Error al importar productos:', error)
      return false
    }
  }

  const limpiarDatos = () => {
    setProductos([])
    localStorage.removeItem(PRODUCTOS_STORAGE_KEY)
  }

  const value: ProductosContextType = {
    productos: productos.filter(p => p.activo), // Solo mostrar productos activos
    isLoading,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductoPorId,
    obtenerProductosPorCategoria,
    obtenerProductosBajoStock,
    obtenerEstadisticas,
    buscarProductos,
    exportarDatos,
    importarDatos,
    limpiarDatos
  }

  return (
    <ProductosContext.Provider value={value}>
      {children}
    </ProductosContext.Provider>
  )
}

// Hook para usar el contexto
export const useProductos = () => {
  const context = useContext(ProductosContext)
  if (context === undefined) {
    throw new Error('useProductos debe ser usado dentro de un ProductosProvider')
  }
  return context
}

// Hooks específicos para diferentes operaciones
export const useProductosEstadisticas = () => {
  const { obtenerEstadisticas } = useProductos()
  return obtenerEstadisticas()
}

export const useProductosBajoStock = () => {
  const { obtenerProductosBajoStock } = useProductos()
  return obtenerProductosBajoStock()
}

export const useProductosPorCategoria = (categoria: string) => {
  const { obtenerProductosPorCategoria } = useProductos()
  return obtenerProductosPorCategoria(categoria)
}

export const useBuscarProductos = (termino: string) => {
  const { buscarProductos } = useProductos()
  return buscarProductos(termino)
}
