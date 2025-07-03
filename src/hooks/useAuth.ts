import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const user = session?.user

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        const errorData = JSON.parse(result.error)
        throw new Error(errorData.message[0] || 'Error de login')
      }

      if (result?.ok) {
        router.push('/') // Redirigir al dashboard
        return true
      }

      return false
    } catch (error: any) {
      throw error
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  const getToken = () => {
    return session?.user?.accessToken || null
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    getToken,
    session
  }
}
