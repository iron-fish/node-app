import { FC, ReactType } from 'react'
import { Flex, useColorMode, NAMED_COLORS } from '@ironfish/ui-kit'
import { SVGProps } from 'src/svgx/types'
import Hotkey from 'src/components/Hotkey'

export type NavItemProps = {
  active?: boolean
  to: string
  label: string
  icon: ReactType
  hotkey: string
}

export const NavItem: FC<NavItemProps> = ({ active, label, icon, hotkey }) => {
  const { colorMode } = useColorMode()
  const Icon = icon as FC<SVGProps>
  const isLightMode = colorMode === 'light'
  return (
    <>
      <Flex
        flexDirection="row"
        justifyContent={{ base: 'center', sm: 'flex-start' }}
        alignItems="center"
        width={{ base: '3.5rem', sm: '14.5rem' }}
        h="2.5rem"
        borderRadius="4px"
        p="0.5rem"
        bg={
          active
            ? isLightMode
              ? NAMED_COLORS.LIGHTER_GREY
              : NAMED_COLORS.DARK_GREY
            : 'transparent'
        }
        _hover={{
          background: isLightMode
            ? NAMED_COLORS.LIGHTER_GREY
            : NAMED_COLORS.DARK_GREY,
          '&::before': {
            position: 'absolute',
            left: '4.25rem',
            content: '""',
            width: 0,
            height: 0,
            border: '10px solid transparent',
            borderRightColor: isLightMode ? 'black' : 'white',
            display: { base: 'flex', sm: 'none' },
          },
          '&::after': {
            content: `"${label}"`,
            borderRadius: '4px',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            display: { base: 'flex', sm: 'none' },
            left: '5.5rem',
            bg: isLightMode ? 'black' : 'white',
            color: isLightMode ? 'white' : 'black',
            height: '2.5rem',
            maxWidth: '8rem',
            whiteSpace: 'nowrap',
            padding: '0.5rem 0.75rem',
            fontSize: '0.75rem',
            fontFamily: 'favorit-regular',
          },
        }}
        cursor="pointer"
      >
        <Icon
          fill={isLightMode ? NAMED_COLORS.BLACK : NAMED_COLORS.WHITE}
          style={{ minWidth: '24px' }}
        />
        <Flex
          flexDirection="row"
          paddingLeft="1rem"
          fontSize="0.875rem"
          color={isLightMode ? NAMED_COLORS.GREY : NAMED_COLORS.PALE_GREY}
          display={{ base: 'none', sm: 'flex' }}
          whiteSpace="nowrap"
          w="100%"
          fontFamily="extended-regular"
          alignItems="center"
          justifyContent="space-between"
        >
          {label}
          {active && <Hotkey>{hotkey}</Hotkey>}
        </Flex>
      </Flex>
    </>
  )
}

export default NavItem
