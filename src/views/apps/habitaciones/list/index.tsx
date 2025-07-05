'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import RoomListTable from './RoomListTable'
import HistorialHabitaciones from '../historial'

// Context Imports
import { type Habitacion } from '@/contexts/HabitacionesContext'

const RoomList = ({ roomData }: { roomData?: Habitacion[] }) => {
  // States
  const [activeTab, setActiveTab] = useState('lista')

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <TabList
            onChange={handleTabChange}
            aria-label="Pestañas de habitaciones"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              value='lista'
              label='Habitaciones'
              icon={<i className='tabler-bed' />}
              iconPosition='start'
            />
            <Tab
              value='historial'
              label='Historial'
              icon={<i className='tabler-history' />}
              iconPosition='start'
            />
          </TabList>

          <TabPanel value='lista' className='p-0'>
            <RoomListTable tableData={roomData} />
          </TabPanel>

          <TabPanel value='historial' className='p-0'>
            <HistorialHabitaciones />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default RoomList
