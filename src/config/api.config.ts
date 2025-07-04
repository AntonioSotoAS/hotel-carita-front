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
  },

  // Token de la API de apiperu.dev
  TOKEN: 'a18d194266f9398bc8b0b73c219bd0cd6545d1ac7d73b5c2c465b373a7edd08a', // ⚠️ REEMPLAZAR CON TU TOKEN REAL

  // URLs de la API
  DNI_URL: 'https://apiperu.dev/api/dni',
  RUC_URL: 'https://apiperu.dev/api/ruc',

  // Headers por defecto
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
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

// Función para obtener headers con autorización
export const getAuthHeaders = () => ({
  ...API_CONFIG.HEADERS,
  'Authorization': `Bearer ${API_CONFIG.TOKEN}`
})
