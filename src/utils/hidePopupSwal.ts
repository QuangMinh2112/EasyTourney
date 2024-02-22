import { useEffect } from 'react'
import Swal from 'sweetalert2'

export default function useHideSwalOnBack() {
  useEffect(() => {
    const handlePopState = () => {
      console.log('useHideSwalOnBack')
      Swal.close()
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])
}
