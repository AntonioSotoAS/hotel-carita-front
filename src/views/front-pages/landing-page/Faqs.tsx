// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'
import styles from './styles.module.css'

type FaqsDataTypes = {
  id: string
  question: string
  active?: boolean
  answer: string
}

const FaqsData: FaqsDataTypes[] = [
  {
    id: 'panel1',
    question: '¿Qué servicios están incluidos en el precio?',
    answer:
      'Todas nuestras habitaciones incluyen WiFi gratuito, desayuno buffet, aire acondicionado, TV por cable, acceso al gimnasio y piscina. Los servicios adicionales como spa, lavandería y room service tienen tarifas especiales.'
  },
  {
    id: 'panel2',
    question: '¿Cuáles son los horarios de check-in y check-out?',
    active: true,
    answer:
      'El check-in es a partir de las 3:00 PM y el check-out hasta las 12:00 PM. Ofrecemos servicios de check-in/out temprano o tardío bajo disponibilidad y pueden aplicar cargos adicionales. Nuestro servicio de equipaje está disponible 24/7.'
  },
  {
    id: 'panel3',
    question: '¿El hotel cuenta con estacionamiento?',
    answer:
      'Sí, contamos con estacionamiento privado gratuito para nuestros huéspedes. El estacionamiento está vigilado las 24 horas y tiene capacidad para 80 vehículos. También ofrecemos servicio de valet parking con costo adicional.'
  },
  {
    id: 'panel4',
    question: '¿Permiten mascotas en el hotel?',
    answer:
      'Sí, somos pet-friendly. Aceptamos mascotas pequeñas y medianas (hasta 25kg) con un cargo adicional de S/ 50 por noche. Las mascotas deben estar vacunadas y con su documentación al día. Contamos con áreas especiales para el paseo de mascotas.'
  }
]

const Faqs = () => {
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
    <section id='faq' ref={ref} className={classnames('plb-[100px] bg-backgroundDefault', styles.sectionStartRadius)}>
      <div className={classnames('flex flex-col gap-16', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col gap-y-4 items-center justify-center'>
          <Chip size='small' variant='tonal' color='primary' label='Preguntas Frecuentes' />
          <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
            <div className='flex items-center gap-x-2'>
              <Typography color='text.primary' variant='h4'>
                Preguntas
                <span className='relative z-[1] font-extrabold'>
                  <img
                    src='/images/front-pages/landing-page/bg-shape.png'
                    alt='bg-shape'
                    className='absolute block-end-0 z-[1] bs-[40%] is-[132%] -inline-start-[8%] block-start-[17px]'
                  />{' '}
                  frecuentes
                </span>
              </Typography>
            </div>
            <Typography className='text-center'>
              Encuentra respuestas a las consultas más comunes sobre nuestros servicios.
            </Typography>
          </div>
        </div>
        <div>
          <Grid container spacing={6}>
            <Grid item xs={12} lg={5} className='text-center'>
              <img
                src='/images/front-pages/landing-page/boy-sitting-with-laptop.png'
                alt='boy with laptop'
                className='is-[80%] max-is-[320px]'
              />
            </Grid>
            <Grid item xs={12} lg={7}>
              <div>
                {FaqsData.map((data, index) => {
                  return (
                    <Accordion key={index} defaultExpanded={data.active}>
                      <AccordionSummary
                        aria-controls={data.id + '-content'}
                        id={data.id + '-header'}
                        className='font-medium'
                        color='text.primary'
                      >
                        {data.question}
                      </AccordionSummary>
                      <AccordionDetails className='text-textSecondary'>{data.answer}</AccordionDetails>
                    </Accordion>
                  )
                })}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </section>
  )
}

export default Faqs
