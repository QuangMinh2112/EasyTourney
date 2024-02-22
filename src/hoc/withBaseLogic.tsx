import React from 'react'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { useLocation, useNavigate } from 'react-router-dom'

export type BaseLogicProps = {
  navigate: ReturnType<typeof useNavigate>
  location: Location
  dispatch: Dispatch<any>
}

const withBaseLogic = <P extends BaseLogicProps>(Component: React.ComponentType<P>) => {
  const WithBaseLogic: React.FC<Omit<P, keyof BaseLogicProps>> = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    return <Component {...(props as P)} navigate={navigate} location={location} dispatch={dispatch} />
  }

  WithBaseLogic.displayName = `WithBaseLogic(${Component.displayName || Component.name || 'Component'})`

  return WithBaseLogic
}

export default withBaseLogic
