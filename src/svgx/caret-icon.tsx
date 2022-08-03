import { SVGProps } from './types'

export const Icon = ({ fill, ...props }: SVGProps) => (
  <svg
    width="20"
    height="22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7.15825 7.1187L10.9749 11L7.15825 14.8812L8.33325 16.0735L13.3333 11L8.33325 5.92642L7.15825 7.1187Z"
      fill={fill || '#7F7F7F'}
    />
  </svg>
)

export default Icon
