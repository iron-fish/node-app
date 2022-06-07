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
      d="m12 5.69 5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5ZM12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3Z"
      fill={fill}
    />
  </svg>
)

export default Icon
