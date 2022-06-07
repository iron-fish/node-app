import { SVGProps } from './types'

export const Icon = ({ style, fill = '#0d0c22' }: SVGProps) => (
  <svg
    width="24"
    height="24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path
      d="M4 18.402 5.504 20 17.867 6.865v7.468H20V3H9.333v2.267h7.03L4 18.402Z"
      fill={fill}
    />
  </svg>
)

export default Icon
