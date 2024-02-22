import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import './index.css'
import theme from './theme'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssVarsProvider theme={theme}>
          <CssBaseline />
          <App />
        </CssVarsProvider>
      </LocalizationProvider>
    </React.StrictMode>
  </Provider>
)
