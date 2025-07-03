import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    token: string
    rol: string
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      accessToken: string
      rol: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    rol: string
    id: string
  }
}
