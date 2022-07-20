import {
  Icon,
  IconProps,
  NAMED_COLORS,
  useColorModeValue,
} from '@ironfish/ui-kit'

export const HexfishLogo = (props: IconProps) => {
  const color = useColorModeValue(NAMED_COLORS.DEEP_BLUE, NAMED_COLORS.WHITE)
  return (
    <Icon
      width="29"
      height="18"
      fill="none"
      viewBox="0 0 29 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M28.06 8.802 23.47.854a.633.633 0 0 0-.547-.317h-9.181a.633.633 0 0 0-.549.317L9.25 7.685a.285.285 0 0 1-.317.13.283.283 0 0 1-.21-.272V4.9A4.366 4.366 0 0 0 4.364.54H.634A.635.635 0 0 0 0 1.172v3.729a4.278 4.278 0 0 0 2.64 3.962.28.28 0 0 1 0 .518A4.263 4.263 0 0 0 0 13.34v3.728c0 .35.284.635.634.635h3.729a4.366 4.366 0 0 0 4.36-4.361v-2.643c0-.127.087-.24.21-.273a.287.287 0 0 1 .317.13l3.943 6.831a.635.635 0 0 0 .549.317h9.179a.633.633 0 0 0 .548-.317l4.589-7.948a.628.628 0 0 0 .084-.315.619.619 0 0 0-.082-.32Zm-9.659 3.65c-1.79 0-3.247-1.495-3.247-3.333 0-1.837 1.456-3.333 3.247-3.333 1.79 0 3.247 1.496 3.247 3.333 0 1.838-1.456 3.334-3.247 3.334Z"
        fill={color}
      />
    </Icon>
  )
}

export default HexfishLogo
