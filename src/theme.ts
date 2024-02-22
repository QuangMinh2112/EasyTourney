// export default Theme
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const Theme = extendTheme({
  colorSchemes: {
    light: {},
    dark: {}
  },

  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '0.5rem',
          width: '32vw !important',
          maxWidth: '500px !important'
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '5px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            background: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: 'gray'
          }
        },
        '.MuiDataGrid-cell:focus-within': {
          border: 'none',
          outline: 'none'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '&.MuiTextField-root': {
            marginTop: '0.25rem !important'
          },
          '& .MuiInputBase-input': {
            padding: '0.8rem 1rem'
          },
          '&.login-textfield .MuiInputBase-input': {
            padding: '1rem 1rem'
          }
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            padding: '0'
          },
          '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
            padding: '0.8rem 1rem'
          }
        }
      }
    },
    MuiStack: {
      styleOverrides: {
        root: {
          '&.MuiStack-root': {
            spacing: '2',
            width: '100% !important'
          }
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          '&.MuiDialogTitle-root.MuiTypography-root': {
            fontSize: '1.7rem !important',
            textAlign: 'center'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderWidth: '0.5px',
          '&:hover': {
            borderWidth: '0.5px'
          }
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          '&.MuiDialogContent-root': {
            padding: '0 24px 20px !important'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiDialogContent-root': {
            fontFamily: 'Poppins, sans-serif !important'
          }
        }
      }
    }
  }
})

export default Theme
