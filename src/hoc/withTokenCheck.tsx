import React, { useEffect } from 'react'
import { checkToken } from '../apis/axios/auth/login'
import { useNavigate } from 'react-router-dom'

const withTokenCheck = (WrappedComponent: React.ComponentType) => {
  const WithTokenCheck: React.FC = () => {
    const navigate = useNavigate()

    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) {
            return
          }
          const response = await checkToken({ token })
          if (response.data === undefined) {
            localStorage.removeItem('token')
            navigate('/login')
          }
        } catch (error) {
          console.warn('Error fetching data:', error)
        }
      }
      fetchData()
    }, [navigate])

    return <WrappedComponent />
  }

  return WithTokenCheck
}

export default withTokenCheck
