import {
  useColorModeValue,
  chakra,
  NAMED_COLORS,
  Icon,
  IconProps,
} from '@ironfish/ui-kit'

export const CaretInCircle = (props: IconProps) => {
  const $colors = useColorModeValue(
    {
      circleFill: NAMED_COLORS.WHITE,
      circleStroke: NAMED_COLORS.LIGHT_GREY,
      circleStrokeHover: NAMED_COLORS.DEEP_BLUE,
      pathColor: NAMED_COLORS.BLACK,
    },
    {
      circleFill: NAMED_COLORS.LIGHT_BLACK,
      circleStroke: NAMED_COLORS.GREY,
      circleStrokeHover: NAMED_COLORS.WHITE,
      pathColor: NAMED_COLORS.WHITE,
    }
  )
  return (
    <Icon
      width="24px"
      height="24px"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        ':hover>path': {
          fill: NAMED_COLORS.BLACK,
        },
        ':hover>circle': {
          stroke: $colors.circleStrokeHover,
          fill: NAMED_COLORS.WHITE,
        },
      }}
      {...props}
    >
      <chakra.circle
        cx="12"
        cy="12"
        r="11.5"
        fill={$colors.circleFill}
        stroke={$colors.circleStroke}
      />
      <path
        d="M14.273 15.06 11.22 12l3.053-3.06-.94-.94-4 4 4 4 .94-.94Z"
        fill="currentColor"
      />
    </Icon>
  )
}

export default CaretInCircle
