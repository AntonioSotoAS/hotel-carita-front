import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';
import { API_CONFIG } from '../config/api.config';

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para requests (agregar token de autenticación)
apiClient.interceptors.request.use(
  (config) => {
    // ✅ Obtener token del localStorage (solución simple)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔧 DEBUG: Token enviado en request:', token.substring(0, 20) + '...');
      } else {
        console.log('⚠️ DEBUG: No hay token en localStorage');
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses (manejar errores globales)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      console.log('❌ DEBUG: Error 401 - Token inválido o expirado');

      if (typeof window !== 'undefined') {
        // ✅ Limpiar localStorage y redirigir
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
