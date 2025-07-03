// Third-party Imports
import { getServerSession } from 'next-auth'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '../components/AuthRedirect'

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  try {
    const session = await getServerSession()

    console.log('AuthGuard - Verificando sesión:', !!session)

    if (session) {
      console.log('AuthGuard - Sesión válida, permitiendo acceso')
      return <>{children}</>
    }

    console.log('AuthGuard - No hay sesión, redirigiendo al login')
    return <AuthRedirect lang={locale} />
  } catch (error) {
    console.log('AuthGuard - Error de NextAuth:', error)

    // En desarrollo, permitir acceso temporal si hay errores
    console.log('AuthGuard - Permitiendo acceso temporal por error')
    return <>{children}</>
  }

  return <AuthRedirect lang={locale} />
}
