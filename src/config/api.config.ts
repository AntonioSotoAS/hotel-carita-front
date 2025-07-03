// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: 10000,

  // Endpoints
  ENDPOINTS: {
    PRODUCTOS: '/productos',
    HABITACIONES: '/habitaciones',
    CLIENTES: '/clientes',
    AUTH: '/auth'
  }
}

// Configuración de desarrollo
export const DEV_CONFIG = {
  API_URL: 'http://localhost:3000',
  DEBUG: process.env.NODE_ENV === 'development'
}

// Configuración de producción
export const PROD_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.sigetic.com',
  DEBUG: false
}

// Configuración actual basada en el entorno
export const CURRENT_CONFIG = process.env.NODE_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG
