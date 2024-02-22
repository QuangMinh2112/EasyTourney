import { createBrowserRouter, Navigate } from 'react-router-dom'
import BaseTemplate from '../templates/base/base.template'
import React from 'react'
import OrganizerTemplate from '../templates/organizer/organizer.template'
import ProtectedRoute from './ProtectedRoute'
import Categories from '../layouts/Categories'
import Organizers from '../layouts/Organizers'
import Tournament from '../layouts/Tournament'
import General from '../layouts/Tournament/General'
import Schedule from '../layouts/Schedule'
import Result from '../layouts/Result'
import { Login } from '../pages/Login'
import NotFound from '../pages/NotFound'
import Teams from '../layouts/Teams'
import Leaderboard from '../layouts/Leaderboard'

const getDefaultRedirectPath = () => {
  const storedRole = localStorage.getItem('userRole')
  const isAdmin = storedRole === 'ADMIN'
  const isOrganizer = storedRole === 'ORGANIZER'
  if (isAdmin) {
    return '/category'
  } else if (isOrganizer) {
    return '/tournament'
  } else {
    return '/login'
  }
}

const LoginWrapper = () => {
  const token = localStorage.getItem('token')

  if (token) {
    return <Navigate to={getDefaultRedirectPath()} replace={true} />
  }

  return <Login />
}

export const router = createBrowserRouter([
  {
    element: <BaseTemplate />,
    children: [
      {
        index: true,
        path: '/',
        element: <Navigate to={getDefaultRedirectPath()} replace={true} />
      },
      {
        path: 'category',
        element: <ProtectedRoute element={<Categories />} allowedRoles={['ADMIN']} />
      },
      {
        path: 'organizer',
        element: <ProtectedRoute element={<Organizers />} allowedRoles={['ADMIN']} />
      },
      {
        path: 'tournament',
        element: <ProtectedRoute element={<Tournament />} allowedRoles={['ADMIN', 'ORGANIZER']} />
      }
    ]
  },
  {
    element: <OrganizerTemplate />,
    children: [
      {
        path: '/tournament',
        element: <Navigate to="/tournament" replace={true} />
      },
      {
        path: '/tournament/:tournamentId/general',
        element: <ProtectedRoute element={<General />} allowedRoles={['ADMIN', 'ORGANIZER']} />
      },
      {
        path: 'tournament/:tournamentId/participant',
        element: <ProtectedRoute element={<Teams />} allowedRoles={['ADMIN', 'ORGANIZER']} />
      },
      {
        path: '/tournament/:tournamentId/schedule',
        element: <ProtectedRoute element={<Schedule />} allowedRoles={['ADMIN', 'ORGANIZER']} />
      },
      {
        path: '/tournament/:tournamentId/result',
        element: <ProtectedRoute element={<Result />} allowedRoles={['ADMIN', 'ORGANIZER']} />
      },
      {
        path: '/tournament/schedule',
        element: <ProtectedRoute element={<Schedule />} allowedRoles={['ADMIN', 'ORGANIZER']} />
      },
      {
        path: '/tournament/:tournamentId/leaderboard',
        element: <ProtectedRoute element={<Leaderboard />} allowedRoles={['ADMIN', 'ORGANIZER']} />
      }
    ]
  },
  {
    path: 'login',
    element: <LoginWrapper />
  },
  {
    path: '*',
    element: <NotFound />
  }
])
