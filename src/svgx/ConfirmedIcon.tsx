import { Icon, IconProps } from '@chakra-ui/react'
import { FC } from 'react'

export const ConfirmedIcon: FC<IconProps> = props => (
  <Icon
    w="0.875rem"
    h="0.625rem"
    viewBox="0 0 14 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M13 1L4.81818 8.5L1 5" stroke="currentColor" strokeWidth="1.5" />
  </Icon>
)

export default ConfirmedIcon
