// Configuración de API del Perú
// Reemplaza 'TU_TOKEN_AQUI' con tu token real de https://apiperu.dev/

export const APIPERU_CONFIG = {
  // Token de la API de apiperu.dev
  TOKEN: 'a18d194266f9398bc8b0b73c219bd0cd6545d1ac7d73b5c2c465b373a7edd08a',

  // URLs de la API
  DNI_URL: 'https://apiperu.dev/api/dni',
  RUC_URL: 'https://apiperu.dev/api/ruc',

  // Headers por defecto
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

// Función para obtener headers con autorización
export const getAuthHeaders = () => ({
  ...APIPERU_CONFIG.HEADERS,
  'Authorization': `Bearer ${APIPERU_CONFIG.TOKEN}`
})
