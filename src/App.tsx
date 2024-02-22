import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ToastContainer } from 'react-toastify'
import { Suspense, useEffect } from 'react'
import { Box, ThemeProvider } from '@mui/material'
import { GlobalStyle } from './styles/GlobalStyle'
import { useDispatch } from 'react-redux'
import { getCategories } from './redux/reducers/categories/categories.slice'
import { ThunkDispatch } from '@reduxjs/toolkit'
import 'react-toastify/dist/ReactToastify.css'
import Theme from './theme'
import useHideSwalOnBack from './utils/hidePopupSwal'

function App() {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])
  useHideSwalOnBack()
  return (
    <Box>
      <Suspense fallback={<>Loading...</>}>
        <ThemeProvider theme={Theme}>
          <GlobalStyle>
            <ToastContainer style={{ fontSize: '15px' }} autoClose={2000} draggable />
            <RouterProvider router={router}></RouterProvider>
          </GlobalStyle>
        </ThemeProvider>
      </Suspense>
    </Box>
  )
}

export default App
