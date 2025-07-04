// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'
import styles from './styles.module.css'

const ContactUs = () => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

  // Hooks
  const { updateIntersections } = useIntersection()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (skipIntersection.current) {
          skipIntersection.current = false

          return
        }

        updateIntersections({ [entry.target.id]: entry.isIntersecting })
      },
      { threshold: 0.35 }
    )

    ref.current && observer.observe(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id='contact-us' className='plb-[100px] bg-backgroundDefault' ref={ref}>
      <div className={classnames('flex flex-col gap-14', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col gap-y-4 items-center justify-center'>
          <Chip size='small' variant='tonal' color='primary' label='Contáctanos' />
          <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
            <div className='flex items-center gap-x-2'>
              <Typography color='text.primary' variant='h4'>
                <span className='relative z-[1] font-extrabold'>
                  Estamos aquí para
                  <img
                    src='/images/front-pages/landing-page/bg-shape.png'
                    alt='bg-shape'
                    className='absolute block-end-0 z-[1] bs-[40%] is-[132%] -inline-start-[19%] block-start-[17px]'
                  />
                </span>{' '}
                ayudarte
              </Typography>
            </div>
            <Typography className='text-center'>¿Tienes alguna pregunta o necesitas hacer una reserva especial?</Typography>
          </div>
        </div>
        <div className='lg:pis-[38px]'>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} lg={5}>
              <div className={classnames('border p-[10px] relative', styles.contactRadius)}>
                <img
                  src='/images/front-pages/landing-page/contact-border.png'
                  className='absolute -block-start-[7%] -inline-start-[8%] max-is-full max-lg:hidden '
                  alt='contact-border'
                  width='180'
                />
                <img
                  src='/images/front-pages/landing-page/customer-service.png'
                  alt='customer-service'
                  className={classnames('is-full', styles.contactRadius)}
                />
                <div className='flex justify-between flex-wrap gap-4 pli-6 pbs-4 pbe-[10px]'>
                  <div className='flex gap-3'>
                    <CustomAvatar variant='rounded' size={36} skin='light' color='primary'>
                      <i className='tabler-mail' />
                    </CustomAvatar>
                    <div>
                      <Typography>Email</Typography>
                      <Typography color='text.primary' className='font-medium'>
                        reservas@hotelcaritafeliz.com
                      </Typography>
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <CustomAvatar variant='rounded' size={36} skin='light' color='success'>
                      <i className='tabler-phone' />
                    </CustomAvatar>
                    <div>
                      <Typography>Teléfono</Typography>
                      <Typography color='text.primary' className='font-medium'>
                        +51 1 234 5678
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={7}>
              <Card>
                <CardContent>
                  <div className='flex flex-col gap-y-[6px] mbe-6'>
                    <Typography variant='h4'>Envíanos un mensaje</Typography>
                    <Typography>
                      Si tienes preguntas sobre reservas, servicios especiales, eventos o cualquier consulta sobre el hotel, estamos aquí para ayudarte.
                    </Typography>
                  </div>
                  <form className='flex flex-col items-start gap-6'>
                    <div className='flex gap-5 is-full'>
                      <CustomTextField fullWidth label='Nombre completo' id='name-input' />
                      <CustomTextField fullWidth label='Correo electrónico' id='email-input' type='email' />
                    </div>
                    <CustomTextField fullWidth multiline rows={7} label='Mensaje' id='message-input' />
                    <Button variant='contained'>Enviar Consulta</Button>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </section>
  )
}

export default ContactUs
