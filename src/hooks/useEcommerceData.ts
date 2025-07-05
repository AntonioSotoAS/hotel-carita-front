'use client'

import { useEffect, useState } from 'react'
import { useEcommerce } from '@/contexts/EcommerceContext'
import type { ECommerceType } from '@/types/apps/ecommerceTypes'

// Hook que reemplaza getEcommerceData para usar el contexto
export const useEcommerceDataHook = () => {
  const { products, orders, customers, reviews, referrals, isLoading, isInitialized } = useEcommerce()

  // Estado para mantener compatibilidad con las server actions
  const [data, setData] = useState<ECommerceType | null>(null)

  useEffect(() => {
    if (isInitialized) {
      setData({
        products,
        orderData: orders,
        customerData: customers,
        reviews,
        referrals
      })
    }
  }, [products, orders, customers, reviews, referrals, isInitialized])

  return {
    data,
    isLoading,
    isInitialized
  }
}

// Hook para obtener datos específicos con filtros
export const useEcommerceFilter = () => {
  const { products, orders, customers, reviews, referrals } = useEcommerce()

  const getFilteredProducts = (filters: {
    category?: string
    status?: string
    stock?: boolean
    priceRange?: [number, number]
  }) => {
    let filtered = products

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category)
    }

    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status)
    }

    if (filters.stock !== undefined) {
      filtered = filtered.filter(p => p.stock === filters.stock)
    }

    if (filters.priceRange) {
      filtered = filtered.filter(p => {
        const price = parseFloat(p.price.replace('$', '').replace(',', ''))
        return price >= filters.priceRange![0] && price <= filters.priceRange![1]
      })
    }

    return filtered
  }

  const getFilteredOrders = (filters: {
    status?: string
    customer?: string
    dateRange?: [Date, Date]
  }) => {
    let filtered = orders

    if (filters.status) {
      filtered = filtered.filter(o => o.status === filters.status)
    }

    if (filters.customer) {
      filtered = filtered.filter(o =>
        o.customer.toLowerCase().includes(filters.customer!.toLowerCase())
      )
    }

    if (filters.dateRange) {
      filtered = filtered.filter(o => {
        const orderDate = new Date(o.date)
        return orderDate >= filters.dateRange![0] && orderDate <= filters.dateRange![1]
      })
    }

    return filtered
  }

  const getFilteredCustomers = (filters: {
    country?: string
    status?: string
    totalSpentRange?: [number, number]
  }) => {
    let filtered = customers

    if (filters.country) {
      filtered = filtered.filter(c => c.country === filters.country)
    }

    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status)
    }

    if (filters.totalSpentRange) {
      filtered = filtered.filter(c =>
        c.totalSpent >= filters.totalSpentRange![0] &&
        c.totalSpent <= filters.totalSpentRange![1]
      )
    }

    return filtered
  }

  return {
    getFilteredProducts,
    getFilteredOrders,
    getFilteredCustomers,
    products,
    orders,
    customers,
    reviews,
    referrals
  }
}

// Hook para estadísticas
export const useEcommerceStats = () => {
  const { products, orders, customers, reviews } = useEcommerce()

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalReviews: reviews.length,

    // Estadísticas de productos
    productsInStock: products.filter(p => p.stock).length,
    productsOutOfStock: products.filter(p => !p.stock).length,

    // Estadísticas de órdenes
    deliveredOrders: orders.filter(o => o.status === 'Delivered').length,
    pendingOrders: orders.filter(o => o.status !== 'Delivered').length,

    // Estadísticas de ventas
    totalRevenue: orders.reduce((sum, o) => sum + o.spent, 0),
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.spent, 0) / orders.length : 0,

    // Estadísticas de clientes
    totalCustomerSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    averageCustomerValue: customers.length > 0 ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length : 0,

    // Estadísticas de reseñas
    averageRating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.review, 0) / reviews.length : 0,

    // Categorías más populares
    categoryStats: products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  return stats
}

// Hook para búsqueda
export const useEcommerceSearch = () => {
  const { products, orders, customers, reviews } = useEcommerce()

  const searchProducts = (query: string) => {
    const searchTerm = query.toLowerCase()
    return products.filter(p =>
      p.productName.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm) ||
      p.productBrand.toLowerCase().includes(searchTerm)
    )
  }

  const searchOrders = (query: string) => {
    const searchTerm = query.toLowerCase()
    return orders.filter(o =>
      o.order.toLowerCase().includes(searchTerm) ||
      o.customer.toLowerCase().includes(searchTerm) ||
      o.email.toLowerCase().includes(searchTerm)
    )
  }

  const searchCustomers = (query: string) => {
    const searchTerm = query.toLowerCase()
    return customers.filter(c =>
      c.customer.toLowerCase().includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm) ||
      c.country.toLowerCase().includes(searchTerm)
    )
  }

  return {
    searchProducts,
    searchOrders,
    searchCustomers
  }
}
