import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { Avatar, Divider, Typography } from '@mui/material'
import { Logout } from '@mui/icons-material'
import KeyIcon from '@mui/icons-material/Key'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../../redux/reducers'
import { getLocalStorage } from '../../../utils/localStorage'
import styles from '../Header.module.css'
import DialogChangePassword from '../../Dialog/ChangePasword/DialogChangePassword'
import { useState } from 'react'

const Header: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter((segment) => segment !== '')
  const [openPassword, setOpenPassword] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [userInfo, setUserInfo] = React.useState<any>(null)
  const [hasScrolled, setHasScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0
      setHasScrolled(scrolled)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  React.useEffect(() => {
    const storedUserInfo = getLocalStorage('user')
    if (storedUserInfo) {
      setUserInfo(storedUserInfo)
    }
  }, [])

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleChangePassword = () => {
    setAnchorEl(null)
    setOpenPassword(true)
  }

  const handleLogout = () => {
    setAnchorEl(null)
    dispatch(logout())
    navigate('/login')
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const capitalizeFirstLetter = (str: any) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <>
      <AppBar
        className={styles['main-app-header']}
        style={{
          boxShadow: hasScrolled
            ? 'rgba(255, 255, 255, 0.9) 0rem 0rem 0.0625rem 0.1rem inset, rgba(0, 0, 0, 0.1) 0rem 1rem 1.6875rem 0rem'
            : 'none',
          top: '1rem',
          position: 'sticky',
          zIndex: 1003,
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
        }}
      >
        <Toolbar className={styles['toolbar']}>
          <Box className={styles['title']}>
            <Typography variant="h5" gutterBottom className={styles['typography-header']}>
              {pathSegments.length > 0 ? capitalizeFirstLetter(pathSegments[pathSegments.length - 1]) : 'Home'}
            </Typography>
          </Box>
          <Box>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            {/* MENU */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                '& .MuiList-root': {
                  padding: '0 !important'
                },
                '& .MuiPaper-root': {
                  borderRadius: '10px !important',
                  padding: '0 !important'
                }
              }}
            >
              <Box className={styles['profile-pictures-wrapper']}>
                <Avatar
                  alt="profile-background"
                  src={`https://images.unsplash.com/photo-1545809074-59472b3f5ecc?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8M`}
                  className={styles['profile-background']}
                />
                <Avatar alt="profile-avatar" src={''} className={styles['profile-avatar']} />
              </Box>
              <MenuItem className={styles['menu-info-item']} onClick={handleClose} disabled>
                <Typography className={styles['username']}>
                  {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'Guest'}
                </Typography>
              </MenuItem>
              <Divider className={styles['menu-divider']} />
              <MenuItem className={styles['menu-list-item']} onClick={handleChangePassword}>
                <Box className={styles['menu-list-text']}>
                  <KeyIcon className={styles['menu-list-icon-password']} />
                  Change Password
                </Box>
                <ChevronRightIcon className={styles['menu-list-icon']} />
              </MenuItem>
              <MenuItem className={styles['menu-list-item']} onClick={handleLogout}>
                <Box className={styles['menu-list-text']}>
                  <Logout className={styles['menu-list-icon-logout']} />
                  Logout
                </Box>
                <ChevronRightIcon className={styles['menu-list-icon']} />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <DialogChangePassword open={openPassword} setOpen={setOpenPassword} />
    </>
  )
}

export default Header
