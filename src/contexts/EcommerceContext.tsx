'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { ECommerceType, ProductType, OrderType, Customer, ReviewType, ReferralsType } from '@/types/apps/ecommerceTypes'
import { LocalStorageService } from '@/utils/localStorage'
import { db as initialData } from '@/fake-db/apps/ecommerce'

interface EcommerceContextType {
  // Estados
  products: ProductType[]
  orders: OrderType[]
  customers: Customer[]
  reviews: ReviewType[]
  referrals: ReferralsType[]
  isLoading: boolean
  isInitialized: boolean

  // Funciones para productos
  addProduct: (product: Omit<ProductType, 'id'>) => boolean
  updateProduct: (id: number, product: Partial<ProductType>) => boolean
  deleteProduct: (id: number) => boolean
  updateProductStock: (id: number, newStock: boolean, newQty?: number) => boolean

  // Funciones para órdenes
  addOrder: (order: Omit<OrderType, 'id'>) => boolean
  updateOrder: (id: number, order: Partial<OrderType>) => boolean
  deleteOrder: (id: number) => boolean
  updateOrderStatus: (id: number, status: string) => boolean

  // Funciones para clientes
  addCustomer: (customer: Omit<Customer, 'id'>) => boolean
  updateCustomer: (id: number, customer: Partial<Customer>) => boolean
  deleteCustomer: (id: number) => boolean

  // Funciones para reseñas
  addReview: (review: Omit<ReviewType, 'id'>) => boolean
  updateReview: (id: number, review: Partial<ReviewType>) => boolean
  deleteReview: (id: number) => boolean

  // Funciones para referidos
  addReferral: (referral: Omit<ReferralsType, 'id'>) => boolean
  updateReferral: (id: number, referral: Partial<ReferralsType>) => boolean
  deleteReferral: (id: number) => boolean

  // Funciones de utilidad
  refreshData: () => void
  exportData: () => string | null
  importData: (jsonData: string) => boolean
  clearAllData: () => boolean
  resetToInitialData: () => void
}

const EcommerceContext = createContext<EcommerceContextType | undefined>(undefined)

interface EcommerceProviderProps {
  children: ReactNode
}

export const EcommerceProvider = ({ children }: EcommerceProviderProps) => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [orders, setOrders] = useState<OrderType[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [reviews, setReviews] = useState<ReviewType[]>([])
  const [referrals, setReferrals] = useState<ReferralsType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = () => {
      setIsLoading(true)

      try {
        // Intentar cargar datos desde localStorage
        const storedData = LocalStorageService.getEcommerceData()

        if (storedData) {
          // Si hay datos en localStorage, usarlos
          setProducts(storedData.products || [])
          setOrders(storedData.orderData || [])
          setCustomers(storedData.customerData || [])
          setReviews(storedData.reviews || [])
          setReferrals(storedData.referrals || [])
        } else {
          // Si no hay datos, usar los datos iniciales y guardarlos
          setProducts(initialData.products)
          setOrders(initialData.orderData)
          setCustomers(initialData.customerData)
          setReviews(initialData.reviews)
          setReferrals(initialData.referrals)

          // Guardar datos iniciales en localStorage
          LocalStorageService.setEcommerceData(initialData)
        }

        setIsInitialized(true)
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error)
        // En caso de error, usar datos iniciales
        setProducts(initialData.products)
        setOrders(initialData.orderData)
        setCustomers(initialData.customerData)
        setReviews(initialData.reviews)
        setReferrals(initialData.referrals)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Función para sincronizar con localStorage
  const syncWithLocalStorage = () => {
    const currentData: ECommerceType = {
      products,
      orderData: orders,
      customerData: customers,
      reviews,
      referrals
    }

    LocalStorageService.setEcommerceData(currentData)
  }

  // Sincronizar con localStorage cada vez que cambien los datos
  useEffect(() => {
    if (isInitialized) {
      syncWithLocalStorage()
    }
  }, [products, orders, customers, reviews, referrals, isInitialized])

  // Funciones para productos
  const addProduct = (product: Omit<ProductType, 'id'>): boolean => {
    try {
      const maxId = products.reduce((max, p) => Math.max(max, p.id), 0)
      const newProduct: ProductType = { ...product, id: maxId + 1 }
      setProducts(prev => [...prev, newProduct])
      return true
    } catch (error) {
      console.error('Error al agregar producto:', error)
      return false
    }
  }

  const updateProduct = (id: number, updatedProduct: Partial<ProductType>): boolean => {
    try {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p))
      return true
    } catch (error) {
      console.error('Error al actualizar producto:', error)
      return false
    }
  }

  const deleteProduct = (id: number): boolean => {
    try {
      setProducts(prev => prev.filter(p => p.id !== id))
      return true
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      return false
    }
  }

  const updateProductStock = (id: number, newStock: boolean, newQty?: number): boolean => {
    try {
      setProducts(prev => prev.map(p =>
        p.id === id
          ? { ...p, stock: newStock, ...(newQty !== undefined && { qty: newQty }) }
          : p
      ))
      return true
    } catch (error) {
      console.error('Error al actualizar stock:', error)
      return false
    }
  }

  // Funciones para órdenes
  const addOrder = (order: Omit<OrderType, 'id'>): boolean => {
    try {
      const maxId = orders.reduce((max, o) => Math.max(max, o.id), 0)
      const newOrder: OrderType = { ...order, id: maxId + 1 }
      setOrders(prev => [...prev, newOrder])
      return true
    } catch (error) {
      console.error('Error al agregar orden:', error)
      return false
    }
  }

  const updateOrder = (id: number, updatedOrder: Partial<OrderType>): boolean => {
    try {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedOrder } : o))
      return true
    } catch (error) {
      console.error('Error al actualizar orden:', error)
      return false
    }
  }

  const deleteOrder = (id: number): boolean => {
    try {
      setOrders(prev => prev.filter(o => o.id !== id))
      return true
    } catch (error) {
      console.error('Error al eliminar orden:', error)
      return false
    }
  }

  const updateOrderStatus = (id: number, status: string): boolean => {
    try {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      return true
    } catch (error) {
      console.error('Error al actualizar estado de orden:', error)
      return false
    }
  }

  // Funciones para clientes
  const addCustomer = (customer: Omit<Customer, 'id'>): boolean => {
    try {
      const maxId = customers.reduce((max, c) => Math.max(max, c.id), 0)
      const newCustomer: Customer = { ...customer, id: maxId + 1 }
      setCustomers(prev => [...prev, newCustomer])
      return true
    } catch (error) {
      console.error('Error al agregar cliente:', error)
      return false
    }
  }

  const updateCustomer = (id: number, updatedCustomer: Partial<Customer>): boolean => {
    try {
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updatedCustomer } : c))
      return true
    } catch (error) {
      console.error('Error al actualizar cliente:', error)
      return false
    }
  }

  const deleteCustomer = (id: number): boolean => {
    try {
      setCustomers(prev => prev.filter(c => c.id !== id))
      return true
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
      return false
    }
  }

  // Funciones para reseñas
  const addReview = (review: Omit<ReviewType, 'id'>): boolean => {
    try {
      const maxId = reviews.reduce((max, r) => Math.max(max, r.id), 0)
      const newReview: ReviewType = { ...review, id: maxId + 1 }
      setReviews(prev => [...prev, newReview])
      return true
    } catch (error) {
      console.error('Error al agregar reseña:', error)
      return false
    }
  }

  const updateReview = (id: number, updatedReview: Partial<ReviewType>): boolean => {
    try {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updatedReview } : r))
      return true
    } catch (error) {
      console.error('Error al actualizar reseña:', error)
      return false
    }
  }

  const deleteReview = (id: number): boolean => {
    try {
      setReviews(prev => prev.filter(r => r.id !== id))
      return true
    } catch (error) {
      console.error('Error al eliminar reseña:', error)
      return false
    }
  }

  // Funciones para referidos
  const addReferral = (referral: Omit<ReferralsType, 'id'>): boolean => {
    try {
      const maxId = referrals.reduce((max, r) => Math.max(max, r.id), 0)
      const newReferral: ReferralsType = { ...referral, id: maxId + 1 }
      setReferrals(prev => [...prev, newReferral])
      return true
    } catch (error) {
      console.error('Error al agregar referido:', error)
      return false
    }
  }

  const updateReferral = (id: number, updatedReferral: Partial<ReferralsType>): boolean => {
    try {
      setReferrals(prev => prev.map(r => r.id === id ? { ...r, ...updatedReferral } : r))
      return true
    } catch (error) {
      console.error('Error al actualizar referido:', error)
      return false
    }
  }

  const deleteReferral = (id: number): boolean => {
    try {
      setReferrals(prev => prev.filter(r => r.id !== id))
      return true
    } catch (error) {
      console.error('Error al eliminar referido:', error)
      return false
    }
  }

  // Funciones de utilidad
  const refreshData = () => {
    const storedData = LocalStorageService.getEcommerceData()
    if (storedData) {
      setProducts(storedData.products || [])
      setOrders(storedData.orderData || [])
      setCustomers(storedData.customerData || [])
      setReviews(storedData.reviews || [])
      setReferrals(storedData.referrals || [])
    }
  }

  const exportData = (): string | null => {
    return LocalStorageService.exportData()
  }

  const importData = (jsonData: string): boolean => {
    try {
      const success = LocalStorageService.importData(jsonData)
      if (success) {
        refreshData()
      }
      return success
    } catch (error) {
      console.error('Error al importar datos:', error)
      return false
    }
  }

  const clearAllData = (): boolean => {
    try {
      const success = LocalStorageService.clearAll()
      if (success) {
        setProducts([])
        setOrders([])
        setCustomers([])
        setReviews([])
        setReferrals([])
      }
      return success
    } catch (error) {
      console.error('Error al limpiar datos:', error)
      return false
    }
  }

  const resetToInitialData = () => {
    try {
      setProducts(initialData.products)
      setOrders(initialData.orderData)
      setCustomers(initialData.customerData)
      setReviews(initialData.reviews)
      setReferrals(initialData.referrals)
      LocalStorageService.setEcommerceData(initialData)
    } catch (error) {
      console.error('Error al resetear datos:', error)
    }
  }

  const value: EcommerceContextType = {
    // Estados
    products,
    orders,
    customers,
    reviews,
    referrals,
    isLoading,
    isInitialized,

    // Funciones para productos
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,

    // Funciones para órdenes
    addOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,

    // Funciones para clientes
    addCustomer,
    updateCustomer,
    deleteCustomer,

    // Funciones para reseñas
    addReview,
    updateReview,
    deleteReview,

    // Funciones para referidos
    addReferral,
    updateReferral,
    deleteReferral,

    // Funciones de utilidad
    refreshData,
    exportData,
    importData,
    clearAllData,
    resetToInitialData
  }

  return (
    <EcommerceContext.Provider value={value}>
      {children}
    </EcommerceContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useEcommerce = () => {
  const context = useContext(EcommerceContext)
  if (context === undefined) {
    throw new Error('useEcommerce debe ser usado dentro de un EcommerceProvider')
  }
  return context
}

// Hook para obtener datos específicos con loading
export const useEcommerceData = () => {
  const { products, orders, customers, reviews, referrals, isLoading, isInitialized } = useEcommerce()

  return {
    data: {
      products,
      orders,
      customers,
      reviews,
      referrals
    },
    isLoading,
    isInitialized
  }
}

// Hook para operaciones de productos
export const useProducts = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    isLoading
  } = useEcommerce()

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    isLoading
  }
}

// Hook para operaciones de órdenes
export const useOrders = () => {
  const {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    isLoading
  } = useEcommerce()

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    isLoading
  }
}

// Hook para operaciones de clientes
export const useCustomers = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    isLoading
  } = useEcommerce()

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    isLoading
  }
}
