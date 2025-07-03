// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import type { NextAuthOptions } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'

const prisma = new PrismaClient()

// Validar variables de entorno críticas
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET no está configurada en las variables de entorno')
}

if (!process.env.NEXTAUTH_URL) {
  throw new Error('NEXTAUTH_URL no está configurada en las variables de entorno')
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,

  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    CredentialProvider({
      // ** The name to display on the sign in form (e.g. 'Sign in with...')
      // ** For more details on Credentials Provider, visit https://next-auth.js.org/providers/credentials
      name: 'Credentials',
      type: 'credentials',

      /*
       * As we are using our own Sign-in page, we do not need to change
       * username or password attributes manually in following credentials object.
       */
      credentials: {},
      async authorize(credentials) {
        /*
         * You need to provide your own logic here that takes the credentials submitted and returns either
         * an object representing a user or value that is false/null if the credentials are invalid.
         * For e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
         * You can also use the `req` object to obtain additional parameters (i.e., the request IP address)
         */
        const { email, password } = credentials as { email: string; password: string }

        // Log de variables de entorno para debugging
        console.log('🔍 DEBUG: Variables de entorno cargadas:')
        console.log('  - NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
        console.log('  - NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
        console.log('  - NODE_ENV:', process.env.NODE_ENV)

        try {
          // ** Login API Call to match the user credentials and receive user data in response along with his role
          const apiUrl = process.env.NEXT_PUBLIC_API_URL

          if (!apiUrl) {
            throw new Error('NEXT_PUBLIC_API_URL no está configurada en las variables de entorno')
          }

          const loginUrl = `${apiUrl}/auth/login`

          console.log('🔍 DEBUG: API URL desde env:', apiUrl)
          console.log('🔍 DEBUG: Intentando conectar a:', loginUrl)
          console.log('🔍 DEBUG: Credenciales enviadas:', { correo: email, password: '***' })

          const res = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              correo: email,
              password: password
            })
          })

          console.log('🔍 DEBUG: Status de respuesta:', res.status)
          console.log('🔍 DEBUG: Headers de respuesta:', Object.fromEntries(res.headers.entries()))

          // Verificar si la respuesta es JSON válido
          const contentType = res.headers.get('content-type')
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('El servidor no está respondiendo correctamente. Verifica que el backend esté corriendo.')
          }

          const data = await res.json()

          console.log('🔍 DEBUG: Datos recibidos del backend:', data)

          if (res.status === 401) {
            throw new Error(JSON.stringify({
              message: ['Credenciales inválidas. Verifica tu correo y contraseña.']
            }))
          }

          if (res.status === 500) {
            throw new Error(JSON.stringify({
              message: ['Error interno del servidor. Intenta nuevamente.']
            }))
          }

          if (res.status === 404) {
            throw new Error(JSON.stringify({
              message: ['Servicio no disponible. Verifica la configuración.']
            }))
          }

          if (res.status === 200 || res.status === 201) {
            /*
             * Please unset all the sensitive information of the user either from API response or before returning
             * user data below. Below return statement will set the user object in the token and the same is set in
             * the session which will be accessible all over the app.
             */
            console.log('✅ DEBUG: Login exitoso! Datos del usuario:', {
              id: data.id,
              correo: data.correo,
              nombre: data.nombre,
              rol: data.rol,
              tieneToken: !!data.token
            })

            return {
              id: data.id,
              email: data.correo,
              name: data.nombre || data.correo,
              token: data.token,
              rol: data.rol
            }
          }

          // Si llega aquí, es un status no manejado
          console.error('❌ DEBUG: Status no manejado:', res.status)
          console.error('❌ DEBUG: Respuesta completa:', data)

          throw new Error(JSON.stringify({
            message: [`Error inesperado (${res.status}). Intenta nuevamente.`]
          }))

        } catch (e: any) {
          // Si el error ya es un string JSON, devolverlo tal como está
          if (e.message && e.message.startsWith('{')) {
            throw new Error(e.message)
          }

          // Si es un error de red o servidor no disponible
          if (e.name === 'TypeError' || e.message.includes('fetch')) {
            throw new Error(JSON.stringify({
              message: ['No se puede conectar al servidor. Verifica que el backend esté corriendo.']
            }))
          }

          // Error genérico
          throw new Error(JSON.stringify({
            message: ['Error de conexión. Intenta nuevamente.']
          }))
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })

    // ** ...add more providers here
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     * If you use a custom credentials provider, user accounts will not be persisted in a database by NextAuth.js (even if one is configured).
     * The option to use JSON Web Tokens for session tokens must be enabled to use a custom credentials provider.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 30 * 24 * 60 * 60 // ** 30 days
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/login'
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    /*
     * While using `jwt` as a strategy, `jwt()` callback will be called before
     * the `session()` callback. So we have to add custom parameters in `token`
     * via `jwt()` callback to make them accessible in the `session()` callback
     */
    async jwt({ token, user }) {
      if (user) {
        /*
         * For adding custom parameters to user in session, we first need to add those parameters
         * in token which then will be available in the `session()` callback
         */
        token.name = user.name
        token.accessToken = user.token  // ✅ Guardar el token del backend
        token.rol = user.rol           // ✅ Guardar el rol
        token.id = user.id             // ✅ Guardar el ID
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter
        session.user.name = token.name ?? session.user.name ?? 'Usuario'
        session.user.accessToken = token.accessToken ?? ''  // ✅ Hacer accesible el token
        session.user.rol = token.rol ?? ''                   // ✅ Hacer accesible el rol
        session.user.id = token.id ?? ''                     // ✅ Hacer accesible el ID
      }

      return session
    }
  }
}
