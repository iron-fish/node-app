import { FC } from 'react'
import { Flex, chakra, FlexProps, NAMED_COLORS } from '@ironfish/ui-kit'

interface WarningMessage extends Omit<FlexProps, 'style'> {
  message: string
  isVisible: boolean
  style?: 'warning' | 'danger'
}

const LIGHT_COLORS = {
  text: {
    warning: '#7E7400',
    danger: NAMED_COLORS.RED,
  },
  bg: {
    warning: '#FFF9BC',
    danger: '#FFEDE8',
  },
}

const DARK_COLORS = {
  text: {
    warning: '#FFF9BC',
    danger: NAMED_COLORS.RED,
  },
  bg: {
    warning: '#444123',
    danger: '#3E251B',
  },
}

const WarningMessage: FC<WarningMessage> = ({
  message,
  isVisible = false,
  style = 'warning',
  ...rest
}) => {
  return (
    <Flex
      display={isVisible ? 'flex' : 'none'}
      borderRadius="0.3125rem"
      bg={LIGHT_COLORS.bg[style]}
      _dark={{
        bg: DARK_COLORS.bg[style],
      }}
      height="4.3125rem"
      justifyContent="center"
      alignItems="center"
      px="1rem"
      {...rest}
    >
      <chakra.h4
        color={LIGHT_COLORS.text[style]}
        _dark={{
          color: DARK_COLORS.text[style],
        }}
      >
        {message}
      </chakra.h4>
    </Flex>
  )
}

export default WarningMessage
