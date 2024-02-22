import React from 'react'
import styles from './NotFound.module.css'
import { Box } from '@mui/material'
function NotFound() {
  return (
    <Box className={styles.container}>
      <Box>
        <img className={styles.img404} src="https://www.dienmayxanh.com/html/%C4%90MX/destop/images/404.png" alt="" />
      </Box>

      <Box className={styles.contet}>
        <h2 className={styles.text}>Whoops, we could not find the page you were looking for!</h2>
      </Box>
    </Box>
  )
}

export default NotFound
