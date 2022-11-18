import { Icon, IconProps } from '@ironfish/ui-kit'

export const FileIcon = (props: IconProps) => (
  <Icon
    width="12px"
    height="14px"
    fill="none"
    viewBox="0 0 12 14"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.317 10.833h5.366v-1H3.316v1Zm0-2.833h5.366V7H3.316v1Zm-1.65 5.667a.96.96 0 0 1-.7-.3.96.96 0 0 1-.3-.7V1.333c0-.266.1-.5.3-.7.2-.2.433-.3.7-.3h6.016l3.65 3.65v8.684c0 .266-.1.5-.3.7-.2.2-.433.3-.7.3H1.667Zm5.516-9.234v-3.1H1.667v11.334h8.666V4.433h-3.15Zm-5.516-3.1v3.1-3.1 11.334V1.333Z"
      fill="#000"
    />
  </Icon>
)

export default FileIcon
