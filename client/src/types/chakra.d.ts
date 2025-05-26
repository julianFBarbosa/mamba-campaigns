import { ComponentProps } from 'react'
import { LinkProps as RouterLinkProps } from 'react-router-dom'
import { ButtonProps, IconButtonProps } from '@chakra-ui/react'

declare module '@chakra-ui/react' {
  // Add support for as={RouterLink} and to prop
  export interface ButtonProps extends ComponentProps<'button'> {
    as?: any
    to?: string
  }

  export interface IconButtonProps extends ButtonProps {
    icon?: React.ReactElement
    'aria-label': string
  }
} 