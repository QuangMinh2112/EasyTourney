import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ReorderIcon from '@mui/icons-material/Reorder'
import SortIcon from '@mui/icons-material/Sort'
import WysiwygIcon from '@mui/icons-material/Wysiwyg'
import GroupsIcon from '@mui/icons-material/Groups'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { IconButton } from '@mui/material'
import styles from './SidebarOrganizer.module.css'
import React from 'react'

type SidebarProps = {
  onToggleCollapse: () => void
}

function SidebarOrganizer({ onToggleCollapse }: SidebarProps) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [tournamentId, setTournamentId] = useState('')
  useEffect(() => {
    setTournamentId(location.pathname.split('/')[2])
  }, [])

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed)
    onToggleCollapse()
  }
  return (
    <Box className={`${styles.sidebar} ${collapsed && styles['sidebar-collapsed']}`}>
      <Box className={`${styles['sidebar-header']} ${collapsed && styles['sidebar-collapsed']}`}>
        <Box>
          {!collapsed && (
            <>
              <Box className={styles['logo-container']}>
                <Box>
                  <IconButton sx={{ fontSize: 30, color: 'white' }} onClick={handleToggleCollapse}>
                    <ReorderIcon sx={{ fontSize: 30 }} />
                  </IconButton>
                </Box>
                <Typography className={styles['custom-typography']}>EasyTourney</Typography>
              </Box>
            </>
          )}
          {collapsed && (
            <Box>
              <IconButton onClick={handleToggleCollapse}>
                <SortIcon sx={{ fontSize: 30, color: 'white' }} />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
      <hr className={styles['hr-line']} />
      <Box>
        <List
          sx={{
            color: '#fff'
          }}
        >
          <Link style={{ color: 'white', textDecoration: 'none' }} to={`/tournament/${tournamentId}/general`}>
            <ListItem
              className={styles['list-item']}
              button
              selected={location.pathname === `/tournament/${tournamentId}/general`}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: 'black'
                  },
                  '&:hover': {
                    opacity: 0.9,
                    backgroundColor: 'white'
                  }
                },
                '&:hover': {
                  opacity: 0.7
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <WysiwygIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText className={styles['text-menu']} primary="General" />}
            </ListItem>
          </Link>
          <Link
            style={{ color: 'white' }}
            to={{ pathname: `/tournament/${tournamentId}/participant`, search: '?page=1' }}
          >
            <ListItem
              className={styles['list-item']}
              button
              selected={location.pathname === `/tournament/${tournamentId}/participant`}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: 'black'
                  },
                  '&:hover': {
                    opacity: 0.9,
                    backgroundColor: 'white'
                  }
                },
                '&:hover': {
                  opacity: 0.7
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <GroupsIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText className={styles['text-menu']} primary="Participant" />}
            </ListItem>
          </Link>
          <Link style={{ color: 'white' }} to={{ pathname: `/tournament/${tournamentId}/schedule`, search: '?page=1' }}>
            <ListItem
              className={styles['list-item']}
              button
              selected={location.pathname === `/tournament/${tournamentId}/schedule`}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: 'black'
                  },
                  '&:hover': {
                    opacity: 0.9,
                    backgroundColor: 'white'
                  }
                },
                '&:hover': {
                  opacity: 0.7
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <CalendarMonthIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText className={styles['text-menu']} primary="Schedule" />}
            </ListItem>
          </Link>
          <Link style={{ color: 'white' }} to={{ pathname: `/tournament/${tournamentId}/result`, search: '?page=1' }}>
            <ListItem
              className={styles['list-item']}
              button
              selected={location.pathname === `/tournament/${tournamentId}/result`}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: 'black'
                  },
                  '&:hover': {
                    opacity: 0.9,
                    backgroundColor: 'white'
                  }
                },
                '&:hover': {
                  opacity: 0.7
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <ContentPasteIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText className={styles['text-menu']} primary="Result" />}
            </ListItem>
          </Link>
          <Link
            style={{ color: 'white' }}
            to={{ pathname: `/tournament/${tournamentId}/leaderboard`, search: '?page=1' }}
          >
            <ListItem
              className={styles['list-item']}
              button
              selected={location.pathname === `/tournament/${tournamentId}/leaderboard`}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: 'black'
                  },
                  '&:hover': {
                    opacity: 0.9,
                    backgroundColor: 'white'
                  }
                },
                '&:hover': {
                  opacity: 0.7
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <LeaderboardIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText className={styles['text-menu']} primary="Leaderboard" />}
            </ListItem>
          </Link>
        </List>
      </Box>
    </Box>
  )
}

export default SidebarOrganizer
