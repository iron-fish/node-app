import { Icon, IconProps } from '@ironfish/ui-kit'

export const SendIcon = (props: IconProps) => (
  <Icon
    width="24px"
    height="24px"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 18.402 5.504 20 17.867 6.865v7.468H20V3H9.333v2.267h7.03L4 18.402Z"
      fill={'currentColor'}
    />
  </Icon>
)

export default SendIcon
