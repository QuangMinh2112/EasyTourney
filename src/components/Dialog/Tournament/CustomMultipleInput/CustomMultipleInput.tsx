import { memo } from 'react'
import styles from './CustomMuitipleInput.module.css'

interface CustomMultipleInputProps {
  value?: string
  onFocus?: () => void
  handleBlurDatePicker?: () => void
  errorDatePicker?: boolean
}

const CustomMultipleInput = ({ onFocus, value, handleBlurDatePicker, errorDatePicker }: CustomMultipleInputProps) => {
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <textarea
      className={`${styles['list-dates']} ${errorDatePicker && styles['border-error-textarea']}`}
      onFocus={onFocus}
      value={value}
      rows={1}
      readOnly
      onBlur={handleBlurDatePicker}
    />
  )
}

export default memo(CustomMultipleInput)
