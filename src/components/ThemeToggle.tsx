import {
  chakra,
  Flex,
  useColorMode,
  NAMED_COLORS as C,
  useColorModeValue,
} from '@ironfish/ui-kit'
import IconDarkMode from 'Svgx/icon-darkmode'
import IconLightMode from 'Svgx/icon-lightmode'

export const ThemeToggle = () => {
  const { toggleColorMode } = useColorMode()
  const values = useColorModeValue(
    {
      toggleBg: C.LIGHTER_GREY,
      bg: C.WHITE,
      top: '4px',
      left: '4px',
      message: 'Light',
      Icon: IconLightMode,
      iconColor: C.GREY
    },
    {
      toggleBg: C.DARKER_GREY,
      bg: C.BLACK,
      top: '30px',
      left: '50%',
      message: 'Dark',
      Icon: IconDarkMode,
      iconColor: C.LIGHT_GREY
    }
  )
  return (
    <Flex
      overflow="hidden"
      position="relative"
      bg={values.toggleBg}
      borderRadius="5px"
      justifyContent="center"
      alignItems="center"
      w={{ base: '2.125rem', sm: '14.5rem' }}
      h={{ base: '4rem', sm: '2.125rem' }}
      m={{ base: '0.75rem', sm: 'auto' }}
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
        top={{ base: values.top, sm: '4px' }}
        left={{ base: 'inherit', sm: values.left }}
        w={{ base: '26px', sm: 'calc(50% - 6px)' }}
        h={{ base: '1.75rem', sm: '26px' }}
        bg={values.bg}
        borderRadius="5px"
        justifyContent="center"
        alignItems="center"
      >
        <values.Icon
          fill={values.iconColor}
          style={{ width: '14px', height: '14px' }}
        />
        <chakra.span display={{ base: 'none', sm: 'inline-block' }} ml="0.4rem">
          {values.message}
        </chakra.span>
      </Flex>
      <Flex
        h={{ base: '1.75rem', sm: '26px' }}
        m={{ base: '0', sm: '6px' }}
        mr={{ base: '0', sm: '3px' }}
        w={{ base: '1.75rem', sm: '50%' }}
        textAlign="center"
        justifyContent="center"
        alignItems="center"
      >
        <IconLightMode
          fill={C.GREY}
          style={{ width: '14px', height: '14px' }}
        />
        <chakra.span display={{ base: 'none', sm: 'inline-block' }}  ml="0.4rem">
          Light
        </chakra.span>
      </Flex>
      <Flex
        h={{ base: '1.75rem', sm: '26px' }}
        m={{ base: '0', sm: '6px' }}
        ml={{ base: '0', sm: '3px' }}
        w={{ base: '1.75rem', sm: '50%' }}
        textAlign="center"
        justifyContent="center"
        alignItems="center"
      >
        <IconDarkMode fill={C.GREY} style={{ width: '14px', height: '14px' }} />
        <chakra.span display={{ base: 'none', sm: 'inline-block' }} ml="0.4rem">
          Dark
        </chakra.span>
      </Flex>
    </Flex>
  )
}

export default ThemeToggle
