// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Rating from '@mui/material/Rating'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useKeenSlider } from 'keen-slider/react'
import classnames from 'classnames'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppKeenSlider from '@/libs/styles/AppKeenSlider'

// SVG Imports
import HubSpot from '@assets/svg/front-pages/landing-page/HubSpot'
import Pinterest from '@assets/svg/front-pages/landing-page/Pinterest'
import Dribbble from '@assets/svg/front-pages/landing-page/Dribbble'
import Airbnb from '@assets/svg/front-pages/landing-page/Airbnb'
import Coinbase from '@assets/svg/front-pages/landing-page/Coinbase'
import Netflix from '@assets/svg/front-pages/landing-page/Netflix'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'
import styles from './styles.module.css'

// Data
const data = [
  {
    desc: "Excelente atención y habitaciones muy cómodas. La vista al jardín desde mi habitación era hermosa. Definitivamente regresaré.",
    svg: <Pinterest color='#ee7676' />,
    rating: 5,
    name: 'Carmen López',
    position: 'Ejecutiva de Marketing',
    avatarSrc: '/images/avatars/1.png'
  },
  {
    desc: "El desayuno buffet es increíble y el personal muy amable. La ubicación es perfecta para conocer la ciudad.",
    svg: <Netflix color='#d34c4d' />,
    rating: 5,
    name: 'Roberto Silva',
    position: 'Ingeniero de Sistemas',
    avatarSrc: '/images/avatars/2.png'
  },
  {
    desc: "Una experiencia de lujo total. El spa es relajante y las instalaciones están impecables. Altamente recomendado.",
    svg: <Airbnb color='#FF5A60' />,
    rating: 4,
    name: 'Patricia Morales',
    position: 'Directora de Ventas',
    avatarSrc: '/images/avatars/3.png'
  },
  {
    desc: "El servicio a la habitación fue excelente y la atención al cliente superó mis expectativas. Un lugar para volver.",
    svg: <Coinbase color='#0199ff' />,
    rating: 5,
    name: 'Manuel Torres',
    position: 'Consultor Financiero',
    avatarSrc: '/images/avatars/4.png'
  },
  {
    desc: "Las habitaciones son espaciosas y muy bien equipadas. El WiFi funciona perfecto para trabajar desde el hotel.",
    svg: <Dribbble color='#ea4c89' />,
    rating: 5,
    name: 'Diana Vega',
    position: 'Diseñadora Gráfica',
    avatarSrc: '/images/avatars/5.png'
  },
  {
    desc: "La suite presidencial es espectacular. El jacuzzi y la vista panorámica hacen que valga la pena cada sol invertido.",
    svg: <Pinterest color='#ee7676' />,
    rating: 5,
    name: 'Alejandro Ruiz',
    position: 'CEO de Startup',
    avatarSrc: '/images/avatars/6.png',
    color: '#2882C3'
  },
  {
    desc: "Perfecto para viajes de negocios. Las instalaciones para eventos son de primera y el personal muy profesional.",
    svg: <HubSpot color='#FF5C35' />,
    rating: 5,
    name: 'Isabel Castro',
    position: 'Gerente de Proyectos',
    avatarSrc: '/images/avatars/7.png'
  },
  {
    desc: "Un hotel que combina tradición y modernidad. La atención personalizada hace la diferencia en cada detalle.",
    svg: <Airbnb color='#FF5A60' />,
    rating: 4,
    name: 'Fernando Herrera',
    position: 'Arquitecto',
    avatarSrc: '/images/avatars/8.png'
  },
  {
    desc: "La limpieza es impecable y la ubicación estratégica. Cerca de todo lo que necesitas para disfrutar la ciudad.",
    svg: <Coinbase color='#0199ff' />,
    rating: 5,
    name: 'Valentina Jiménez',
    position: 'Médica Especialista',
    avatarSrc: '/images/avatars/9.png'
  },
  {
    desc: "Cada visita es una experiencia nueva. El equipo siempre encuentra formas de sorprender y superar expectativas.",
    svg: <Dribbble color='#ea4c89' />,
    rating: 5,
    name: 'Rodrigo Mendez',
    position: 'Periodista',
    avatarSrc: '/images/avatars/10.png'
  }
]

const CustomerReviews = () => {
  // Hooks
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: {
        perView: 3,
        origin: 'auto'
      },
      breakpoints: {
        '(max-width: 1200px)': {
          slides: {
            perView: 2,
            spacing: 10,
            origin: 'auto'
          }
        },
        '(max-width: 900px)': {
          slides: {
            perView: 2,
            spacing: 10
          }
        },
        '(max-width: 600px)': {
          slides: {
            perView: 1,
            spacing: 10,
            origin: 'center'
          }
        }
      }
    },
    [
      slider => {
        let timeout: ReturnType<typeof setTimeout>
        const mouseOver = false

        function clearNextTimeout() {
          clearTimeout(timeout)
        }

        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 2000)
        }

        slider.on('created', nextTimeout)
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return (
    <section className={classnames('flex flex-col gap-8 plb-[100px] bg-backgroundDefault', styles.sectionStartRadius)}>
      <div
        className={classnames('flex max-md:flex-col max-sm:flex-wrap is-full gap-6', frontCommonStyles.layoutSpacing)}
      >
        <div className='flex flex-col gap-1 bs-full justify-center items-center lg:items-start is-full md:is-[30%] mlb-auto sm:pbs-2'>
          <Chip label='Testimonios de Huéspedes' variant='tonal' color='primary' size='small' className='mbe-3' />
          <div className='flex flex-col gap-y-1 flex-wrap max-lg:text-center '>
            <Typography color='text.primary' variant='h4'>
              <span className='relative z-[1] font-extrabold'>
                Lo que dicen nuestros
                <img
                  src='/images/front-pages/landing-page/bg-shape.png'
                  alt='bg-shape'
                  className='absolute block-end-0 z-[1] bs-[40%] is-[132%] inline-start-[-8%] block-start-[17px]'
                />
              </span> huéspedes
            </Typography>
            <Typography>Descubre las experiencias reales de quienes nos han visitado.</Typography>
          </div>
          <div className='flex gap-x-4 mbs-11'>
            <CustomIconButton color='primary' variant='tonal' onClick={() => instanceRef.current?.prev()}>
              <i className='tabler-chevron-left' />
            </CustomIconButton>
            <CustomIconButton color='primary' variant='tonal' onClick={() => instanceRef.current?.next()}>
              <i className='tabler-chevron-right' />
            </CustomIconButton>
          </div>
        </div>
        <div className='is-full md:is-[70%]'>
          <AppKeenSlider>
            <div ref={sliderRef} className='keen-slider mbe-6'>
              {data.map((item, index) => (
                <div key={index} className='keen-slider__slide flex p-4 sm:p-3'>
                  <Card elevation={8} className='flex items-start'>
                    <CardContent className='p-8 items-center mlb-auto'>
                      <div className='flex flex-col gap-4 items-start'>
                        {item.svg}
                        <Typography>{item.desc}</Typography>
                        <Rating value={item.rating} readOnly />
                        <div className='flex items-center gap-x-3'>
                          <CustomAvatar size={32} src={item.avatarSrc} alt={item.name} />
                          <div className='flex flex-col items-start'>
                            <Typography color='text.primary' className='font-medium'>
                              {item.name}
                            </Typography>
                            <Typography variant='body2' color='text.disabled'>
                              {item.position}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </AppKeenSlider>
        </div>
      </div>
      <Divider />
      <div className='flex flex-wrap items-center justify-center gap-x-16 gap-y-6 mli-3'>
        <Airbnb color='var(--mui-palette-text-secondary)' />
        <Netflix color='var(--mui-palette-text-secondary)' />
        <Dribbble color='var(--mui-palette-text-secondary)' />
        <Coinbase color='var(--mui-palette-text-secondary)' />
        <Pinterest color='var(--mui-palette-text-secondary)' />
      </div>
    </section>
  )
}

export default CustomerReviews
