'use client'

// Third-party Imports
import { SessionProvider } from 'next-auth/react'

// Type Imports
import type { ChildrenType } from '@core/types'

const NextAuthProvider = ({ children, basePath }: ChildrenType & { basePath?: string }) => {
  return <SessionProvider basePath={basePath}>{children}</SessionProvider>
}

export default NextAuthProvider
