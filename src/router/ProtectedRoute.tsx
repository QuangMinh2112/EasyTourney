import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

type ProtectedRouteProps = {
  element: ReactNode
  allowedRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole')
  const isLoggedIn = !!localStorage.getItem('token')
  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  if (allowedRoles.includes(userRole || '')) {
    return <>{element}</>
  } else {
    return <Navigate to="/*" replace />
  }
}

export default ProtectedRoute
