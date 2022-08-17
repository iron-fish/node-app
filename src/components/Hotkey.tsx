import { FC } from 'react'
import { useColorMode, Flex, NAMED_COLORS } from '@ironfish/ui-kit'

export const Hotkey: FC = ({ children }) => {
  const { colorMode } = useColorMode()
  const isLightMode = colorMode === 'light'
  return (
    <Flex
      w="1.5rem"
      h="1.5rem"
      textAlign="center"
      justifyContent="center"
      alignItems="center"
      borderRadius="0.125rem"
      bg={isLightMode ? NAMED_COLORS.LIGHT_GREY : NAMED_COLORS.DARKER_GREY}
    >
      {children}
    </Flex>
  )
}

export default Hotkey
