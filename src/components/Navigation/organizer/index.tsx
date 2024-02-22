import React from 'react'
import { emphasize, styled } from '@mui/material/styles'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Chip from '@mui/material/Chip'
import { useLocation } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'

interface CustomStyledBreadcrumbProps {
  to: string | null
  component?: React.ElementType
  label: string
  icon?: React.ReactElement
}

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor = theme.palette.mode === 'light' ? '#fff' : theme.palette.grey[800]
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
      cursor: 'pointer'
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12)
    }
  }
}) as typeof Chip

const capitalizeFirstLetter = (str: any) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const CustomStyledBreadcrumb: React.FC<CustomStyledBreadcrumbProps> = ({ to, ...props }) => {
  const Component = props.component || 'div'

  return <StyledBreadcrumb component={Component} to={to} {...props} />
}

const CustomizedBreadcrumbsOrganizer: React.FC = () => {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter((segment) => segment !== '' && !Number(segment))

  return (
    <div role="presentation" style={{ backgroundColor: 'transparent', marginTop: '0.2rem' }}>
      <Breadcrumbs aria-label="breadcrumb">
        {pathSegments.map((segment, index) => {
          const isLastSegment = index === pathSegments.length - 1
          const to = isLastSegment ? location.pathname : `/${pathSegments.slice(0, index + 1).join('/')}`

          return (
            <CustomStyledBreadcrumb
              key={segment}
              component={RouterLink}
              to={to}
              label={capitalizeFirstLetter(segment)}
            />
          )
        })}
      </Breadcrumbs>
    </div>
  )
}

export default CustomizedBreadcrumbsOrganizer
