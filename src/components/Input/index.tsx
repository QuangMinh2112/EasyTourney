import React from 'react'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { GridSearchIcon } from '@mui/x-data-grid'

interface InputProps {
  label: string
  type?: string
  placeholder: string
  id: string
  value?: string | number
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  useIcon?: boolean
  hoverIcon?: boolean
}

const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  handleChange,
  useIcon = true,
  hoverIcon = false
}: InputProps) => {
  return (
    <FormControl sx={{ mb: 1 }} variant="outlined">
      <InputLabel
        sx={{
          fontSize: '1rem',
          top: '-6px',
          '&.Mui-focused': {
            top: '0px'
          }
        }}
        htmlFor={id}
      >
        {label}
      </InputLabel>
      <OutlinedInput
        id={id}
        type={type}
        size="small"
        label={label}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        sx={{
          minWidth: '120px',
          '& label': { color: 'gray' },
          '& label.Mui-focused': { color: 'green' },
          '& input': { color: 'gray' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'gray' },
            '&:hover fieldset': { borderColor: 'gray' },
            '&.Mui-focused fieldset': { borderColor: 'green' }
          }
        }}
        endAdornment={
          useIcon && (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                sx={{ '&:hover': { backgroundColor: `${hoverIcon ? '' : 'transparent'}` }, pointerEvents: 'none' }}
              >
                <GridSearchIcon />
              </IconButton>
            </InputAdornment>
          )
        }
      />
    </FormControl>
  )
}

export default Input
