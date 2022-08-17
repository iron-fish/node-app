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
      top: '0.3125rem',
      left: '0.3125rem',
      message: 'Light',
      Icon: IconLightMode,
      iconColor: C.GREY,
    },
    {
      toggleBg: C.DARKER_GREY,
      bg: C.BLACK,
      top: '2.6875rem',
      left: '50%',
      message: 'Dark',
      Icon: IconDarkMode,
      iconColor: C.LIGHT_GREY,
    }
  )
  return (
    <Flex
      overflow="hidden"
      position="relative"
      bg={values.toggleBg}
      borderRadius="0.3125rem"
      justifyContent="center"
      alignItems="center"
      w={{ base: '2.75rem', sm: '14.5rem' }}
      h={{ base: '5.25rem', sm: '2.125rem' }}
      m={{ base: '0.375rem', sm: 'auto' }}
      flexDirection={{ base: 'column', sm: 'row' }}
      onClick={toggleColorMode}
      cursor="pointer"
      fontSize="0.875rem"
    >
      <Flex
        p="0.375rem"
        zIndex="100"
        position="absolute"
        transition="top 0.3s ease-out, left 0.2s ease-out, background 0.16s ease-out"
        top={{ base: values.top, sm: '0.25rem' }}
        left={{ base: 'inherit', sm: values.left }}
        w={{ base: '2.125rem', sm: 'calc(50% - 0.375rem)' }}
        h={{ base: '2.25rem', sm: '1.625rem' }}
        bg={values.bg}
        borderRadius="0.3125rem"
        justifyContent="center"
        alignItems="center"
      >
        <values.Icon
          fill={values.iconColor}
          style={{ width: '1.125rem', height: '1.125rem' }}
        />
        <chakra.span display={{ base: 'none', sm: 'inline-block' }} ml="0.4rem">
          {values.message}
        </chakra.span>
      </Flex>
      <Flex
        h={{ base: '2.25rem', sm: '1.625rem' }}
        m={{ base: '0', sm: '0.375rem' }}
        mr={{ base: '0', sm: '0.1875rem' }}
        w={{ base: '2.25rem', sm: '50%' }}
        textAlign="center"
        justifyContent="center"
        alignItems="center"
      >
        <IconLightMode
          fill={C.GREY}
          style={{ width: '1.125rem', height: '1.125rem' }}
        />
        <chakra.span display={{ base: 'none', sm: 'inline-block' }} ml="0.4rem">
          Light
        </chakra.span>
      </Flex>
      <Flex
        h={{ base: '2.25rem', sm: '1.625rem' }}
        m={{ base: '0', sm: '0.375rem' }}
        ml={{ base: '0', sm: '0.1875rem' }}
        w={{ base: '2.25rem', sm: '50%' }}
        textAlign="center"
        justifyContent="center"
        alignItems="center"
      >
        <IconDarkMode
          fill={C.GREY}
          style={{ width: '1.125rem', height: '1.125rem' }}
        />
        <chakra.span display={{ base: 'none', sm: 'inline-block' }} ml="0.4rem">
          Dark
        </chakra.span>
      </Flex>
    </Flex>
  )
}

export default ThemeToggle
