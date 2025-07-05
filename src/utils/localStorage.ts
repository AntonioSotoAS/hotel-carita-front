import { useState } from 'react'
import type { ECommerceType } from '@/types/apps/ecommerceTypes'

// Claves para localStorage
const STORAGE_KEYS = {
  ECOMMERCE_DATA: 'ecommerce_data',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  REVIEWS: 'reviews',
  REFERRALS: 'referrals'
} as const

// Tipo para las claves de almacenamiento
type StorageKey = keyof typeof STORAGE_KEYS

export class LocalStorageService {
  // Verificar si localStorage está disponible
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, 'test')
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  // Obtener todos los datos de ecommerce
  static getEcommerceData(): ECommerceType | null {
    if (!this.isAvailable()) return null

    try {
      const data = localStorage.getItem(STORAGE_KEYS.ECOMMERCE_DATA)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error al obtener datos de localStorage:', error)
      return null
    }
  }

  // Guardar todos los datos de ecommerce
  static setEcommerceData(data: ECommerceType): boolean {
    if (!this.isAvailable()) return false

    try {
      localStorage.setItem(STORAGE_KEYS.ECOMMERCE_DATA, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Error al guardar datos en localStorage:', error)
      return false
    }
  }

  // Obtener datos específicos por tipo
  static getDataByType<T = any>(type: 'products' | 'orders' | 'customers' | 'reviews' | 'referrals'): T[] | null {
    if (!this.isAvailable()) return null

    try {
      const allData = this.getEcommerceData()
      if (!allData) return null

      switch (type) {
        case 'products':
          return allData.products as T[]
        case 'orders':
          return allData.orderData as T[]
        case 'customers':
          return allData.customerData as T[]
        case 'reviews':
          return allData.reviews as T[]
        case 'referrals':
          return allData.referrals as T[]
        default:
          return null
      }
    } catch (error) {
      console.error(`Error al obtener datos de ${type}:`, error)
      return null
    }
  }

  // Actualizar datos específicos por tipo
  static updateDataByType<T>(
    type: 'products' | 'orders' | 'customers' | 'reviews' | 'referrals',
    newData: T[]
  ): boolean {
    if (!this.isAvailable()) return false

    try {
      const allData = this.getEcommerceData()
      if (!allData) return false

      const updatedData = { ...allData }

      switch (type) {
        case 'products':
          updatedData.products = newData as any[]
          break
        case 'orders':
          updatedData.orderData = newData as any[]
          break
        case 'customers':
          updatedData.customerData = newData as any[]
          break
        case 'reviews':
          updatedData.reviews = newData as any[]
          break
        case 'referrals':
          updatedData.referrals = newData as any[]
          break
        default:
          return false
      }

      return this.setEcommerceData(updatedData)
    } catch (error) {
      console.error(`Error al actualizar datos de ${type}:`, error)
      return false
    }
  }

  // Agregar un nuevo item
  static addItem<T extends { id: number }>(
    type: 'products' | 'orders' | 'customers' | 'reviews' | 'referrals',
    item: T
  ): boolean {
    try {
      const currentData = this.getDataByType<T>(type) || []

      // Generar nuevo ID si no existe
      const maxId = currentData.reduce((max, current) => Math.max(max, current.id), 0)
      const newItem = { ...item, id: item.id || maxId + 1 }

      const updatedData = [...currentData, newItem]
      return this.updateDataByType(type, updatedData)
    } catch (error) {
      console.error(`Error al agregar item a ${type}:`, error)
      return false
    }
  }

  // Actualizar un item existente
  static updateItem<T extends { id: number }>(
    type: 'products' | 'orders' | 'customers' | 'reviews' | 'referrals',
    id: number,
    updatedItem: Partial<T>
  ): boolean {
    try {
      const currentData = this.getDataByType<T>(type) || []
      const itemIndex = currentData.findIndex(item => item.id === id)

      if (itemIndex === -1) return false

      const updatedData = [...currentData]
      updatedData[itemIndex] = { ...updatedData[itemIndex], ...updatedItem }

      return this.updateDataByType(type, updatedData)
    } catch (error) {
      console.error(`Error al actualizar item en ${type}:`, error)
      return false
    }
  }

  // Eliminar un item
  static deleteItem(
    type: 'products' | 'orders' | 'customers' | 'reviews' | 'referrals',
    id: number
  ): boolean {
    try {
      const currentData = this.getDataByType(type) || []
      const filteredData = currentData.filter(item => item.id !== id)

      return this.updateDataByType(type, filteredData)
    } catch (error) {
      console.error(`Error al eliminar item de ${type}:`, error)
      return false
    }
  }

  // Limpiar todos los datos
  static clearAll(): boolean {
    if (!this.isAvailable()) return false

    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Error al limpiar localStorage:', error)
      return false
    }
  }

  // Exportar datos para backup
  static exportData(): string | null {
    try {
      const data = this.getEcommerceData()
      return data ? JSON.stringify(data, null, 2) : null
    } catch (error) {
      console.error('Error al exportar datos:', error)
      return null
    }
  }

  // Importar datos desde backup
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as ECommerceType
      return this.setEcommerceData(data)
    } catch (error) {
      console.error('Error al importar datos:', error)
      return false
    }
  }
}

// Hook personalizado para usar localStorage de manera reactiva
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!LocalStorageService.isAvailable()) return initialValue

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error al leer localStorage:', error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (LocalStorageService.isAvailable()) {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error('Error al escribir localStorage:', error)
    }
  }

  return [storedValue, setValue] as const
}
