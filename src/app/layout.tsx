// Type Imports
import type { ChildrenType } from '@core/types'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Hotel Carita Feliz - Bienvenido a nuestro hotel',
  description: 'Hotel Carita Feliz - Experimenta el lujo y la comodidad en nuestras exclusivas habitaciones. Reserva ahora y disfruta de una experiencia inolvidable.'
}

const RootLayout = ({ children }: ChildrenType) => {
  return (
    <html lang='es' dir='ltr'>
      <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
    </html>
  )
}

export default RootLayout
