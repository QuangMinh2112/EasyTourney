import React, { ReactNode, Fragment } from 'react'
import './GlobalStyle.css'

type Props = {
  children: ReactNode
}

export function GlobalStyle(props: Props) {
  const { children } = props
  return <Fragment>{children}</Fragment>
}
