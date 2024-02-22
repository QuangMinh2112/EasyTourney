import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import React from 'react'
import SidebarOrganizer from '../../components/Sidebar/organizer'
import withTokenCheck from '../../hoc/withTokenCheck'
import styles from '../Template.module.css'
import TournamentHeader from '../../components/Header/Tournament/TournamentHeader'

function OrganizerTemplate() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }
  return (
    <Box className={styles['main-container']}>
      <Box>
        <SidebarOrganizer onToggleCollapse={handleSidebarToggle} />
      </Box>
      <Box className={styles['main-content']} sx={{ paddingLeft: `${sidebarCollapsed ? '8rem' : '18.5rem'}` }}>
        <TournamentHeader />
        <Outlet />
      </Box>
    </Box>
  )
}

export default withTokenCheck(OrganizerTemplate)
