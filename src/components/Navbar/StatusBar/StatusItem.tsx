import {
  Flex,
  FlexProps,
  NAMED_COLORS,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
} from '@ironfish/ui-kit'
import { ReactNode, FC, forwardRef, useMemo } from 'react'

export const LIGHT_COLORS = {
  text: {
    default: '#335A48',
    warning: '#7E7400',
    danger: NAMED_COLORS.RED,
  },
  bg: {
    default: '#EBFBF4',
    warning: '#FFF9BC',
    danger: '#FFE2D9',
  },
}

export const DARK_COLORS = {
  text: {
    default: '#5FC89A',
    warning: '#FFF9BC',
    danger: NAMED_COLORS.RED,
  },
  bg: {
    default: '#192D23',
    warning: '#444123',
    danger: '#3A261D',
  },
}

export interface StatusItemProps extends Omit<FlexProps, 'style' | 'children'> {
  style?: 'default' | 'warning' | 'danger'
  children: (isMinified: boolean) => ReactNode
}

export const StatusItemContent = forwardRef<
  HTMLDivElement,
  { isMinified?: boolean; children: ReactNode } & Omit<
    StatusItemProps,
    'children'
  >
>(({ isMinified = false, style = 'default', children, ...props }, ref) => {
  const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
  return (
    <Flex
      ref={ref}
      p="0.25rem"
      bgColor={colors.bg[style]}
      borderRadius="0.25rem"
      h={isMinified ? '2.75rem' : 'auto'}
      minH="2.125rem"
      width={isMinified ? '2.75rem' : '14.5rem'}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      flexDirection={isMinified ? 'row' : 'column'}
      _hover={{
        border: isMinified ? `0.0625rem solid ${colors.text[style]}` : 'none',
      }}
      borderColor={colors.text[style]}
      color={colors.text[style]}
      {...props}
    >
      {children}
    </Flex>
  )
})

export const StatusItem: FC<StatusItemProps> = ({
  style = 'default',
  children,
  ...props
}) => {
  const small = useBreakpointValue({ base: true, sm: false })
  const colors = useColorModeValue(LIGHT_COLORS, DARK_COLORS)
  const fullContent = useMemo(() => children(false), [])
  const content = useMemo(() => children(small), [small])
  return (
    <Tooltip
      label={
        <StatusItemContent style={style} {...props}>
          {fullContent}
        </StatusItemContent>
      }
      isDisabled={!small}
      placement="right"
      backgroundColor="transparent !important"
      boxShadow="none"
      offset={[0, 16]}
      p={0}
      m={0}
      border={`0.0625rem solid ${colors.text[style]}`}
    >
      <StatusItemContent isMinified={small} style={style} {...props}>
        {content}
      </StatusItemContent>
    </Tooltip>
  )
}
