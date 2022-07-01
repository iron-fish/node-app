import { chakra, Flex, useColorMode, NAMED_COLORS as C } from '@ironfish/ui-kit'
import IconDarkMode from 'Svgx/icon-darkmode'
import IconLightMode from 'Svgx/icon-lightmode'

export const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isLightMode = colorMode === 'light'
  const Other = isLightMode ? IconLightMode : IconDarkMode
  return (
    <Flex
      overflow="hidden"
      position="relative"
      bg={isLightMode ? C.LIGHTER_GREY : C.DARKER_GREY}
      borderRadius="5px"
      justifyContent="center"
      alignItems="center"
      w={{ base: '2.125rem', sm: '14.5rem' }}
      h={{ base: '3.75rem', sm: '2.125rem' }}
      flexDirection={{ base: 'column', sm: 'row' }}
      onClick={toggleColorMode}
      cursor="pointer"
      fontSize="14px"
    >
      <Flex
        p="6px"
        zIndex="100"
        position="absolute"
        transition="top 0.3s ease-out, left 0.2s ease-out, background 0.16s ease-out"
        top={{ base: isLightMode ? '4px' : '30px', sm: '4px' }}
        left={{ base: 'inherit', sm: isLightMode ? '4px' : '50%' }}
        w={{ base: '26px', sm: 'calc(50% - 6px)' }}
        h="26px"
        bg={isLightMode ? C.WHITE : C.BLACK}
        borderRadius="2px"
        justifyContent="center"
        alignItems="center"
      >
        <Other
          fill={isLightMode ? C.BLACK : C.WHITE}
          style={{ width: '14px', height: '14px' }}
        />
        <chakra.span display={{ base: 'none', sm: 'inline-block' }}>
          {isLightMode ? 'Light' : 'Dark'}
        </chakra.span>
      </Flex>
      <Flex
        minHeight="26px"
        m={{ base: '0', sm: '6px' }}
        mr={{ base: '0', sm: '3px' }}
        w={{ base: '26px', sm: '50%' }}
        textAlign="center"
        justifyContent="center"
        alignItems="center"
      >
        <IconLightMode
          fill={C.GREY}
          style={{ width: '14px', height: '14px' }}
        />
        <chakra.span display={{ base: 'none', sm: 'inline-block' }}>
          Light
        </chakra.span>
      </Flex>
      <Flex
        minHeight="26px"
        m={{ base: '0', sm: '6px' }}
        ml={{ base: '0', sm: '3px' }}
        w={{ base: '26px', sm: '50%' }}
        textAlign="center"
        justifyContent="center"
        alignItems="center"
      >
        <IconDarkMode fill={C.GREY} style={{ width: '14px', height: '14px' }} />
        <chakra.span display={{ base: 'none', sm: 'inline-block' }}>
          Dark
        </chakra.span>
      </Flex>
    </Flex>
  )
}

export default ThemeToggle
