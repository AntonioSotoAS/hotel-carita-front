import { useState, useEffect } from 'react'

interface User {
  id: number
  email: string
  role: string
  name?: string
}

interface UseUserRoleReturn {
  userRole: string
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  isUser: boolean
}

export const useUserRole = (): UseUserRoleReturn => {
  const [userRole, setUserRole] = useState<string>('user')
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
    const getUserInfo = () => {
      try {
        setIsLoading(true)

        // Intentar obtener el usuario desde localStorage
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const userData = JSON.parse(userStr)

          // Lógica simple: admin@caritafeliz.com = admin, cualquier otro = user
          const determinedRole = userData.email === 'admin@caritafeliz.com' ? 'admin' : 'user'

          const userWithRole = {
            ...userData,
            role: determinedRole
          }

          setUser(userWithRole)
          setUserRole(determinedRole)
          console.log('🔍 ROL DETERMINADO:', { email: userData.email, role: determinedRole })
          setIsLoading(false)
          return
        }

        // Si no hay usuario, verificar si hay token de autenticación
        const token = localStorage.getItem('accessToken')
        if (token) {
          try {
            // Decodificar el token JWT para obtener el email
            const payload = JSON.parse(atob(token.split('.')[1]))
            const email = payload.email || payload.correo

            // Lógica simple: admin@caritafeliz.com = admin, cualquier otro = user
            const determinedRole = email === 'admin@caritafeliz.com' ? 'admin' : 'user'

            const userData = {
              id: payload.sub || payload.id,
              email: email,
              role: determinedRole,
              name: payload.name || payload.nombre
            }
            setUser(userData)
            setUserRole(determinedRole)
            console.log('🔍 ROL DETERMINADO DESDE TOKEN:', { email, role: determinedRole })
          } catch (tokenError) {
            console.error('Error al decodificar el token:', tokenError)
            setUserRole('user')
          }
        } else {
          // No hay usuario ni token, establecer como user por defecto
          setUserRole('user')
        }
      } catch (error) {
        console.error('Error al obtener información del usuario:', error)
        setUserRole('user')
      } finally {
        setIsLoading(false)
      }
    }

    getUserInfo()

    // Escuchar cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'accessToken') {
        getUserInfo()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return {
    userRole,
    user,
    isLoading,
    isAdmin: userRole === 'admin',
    isUser: userRole === 'user'
  }
}
