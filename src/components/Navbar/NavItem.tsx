import { FC } from 'react'
import { Flex, NAMED_COLORS, useColorModeValue } from '@ironfish/ui-kit'
import { SVGProps } from 'Svgx/types'
import Hotkey from 'Components/Hotkey'

export type NavItemProps = {
  active?: boolean
  to: string
  label: string
  icon: FC<SVGProps>
  hotkey: string
}

export const NavItem: FC<NavItemProps> = ({ active, label, icon, hotkey }) => {
  const Icon = icon as FC<SVGProps>
  const $colors = useColorModeValue(
    {
      bg: NAMED_COLORS.LIGHTER_GREY,
      hover: NAMED_COLORS.DEEP_BLUE,
      borderRightColor: NAMED_COLORS.BLACK,
      afterColor: NAMED_COLORS.WHITE,
      afterBg: NAMED_COLORS.BLACK,
      iconColor: NAMED_COLORS.BLACK,
      fontColor: NAMED_COLORS.GREY,
      activeFontColor: NAMED_COLORS.BLACK,
    },
    {
      bg: NAMED_COLORS.DARK_GREY,
      hover: NAMED_COLORS.WHITE,
      borderRightColor: NAMED_COLORS.WHITE,
      afterColor: NAMED_COLORS.BLACK,
      afterBg: NAMED_COLORS.WHITE,
      iconColor: NAMED_COLORS.WHITE,
      fontColor: NAMED_COLORS.PALE_GREY,
      activeFontColor: NAMED_COLORS.WHITE,
    }
  )
  return (
    <>
      <Flex
        flexDirection="row"
        justifyContent={{ base: 'center', sm: 'flex-start' }}
        alignItems="center"
        width={{ base: '3.5rem', sm: '14.5rem' }}
        h="2.5rem"
        borderRadius="0.25rem"
        p={{ base: '0.5rem', sm: '0.5rem 0.5rem 0.5rem 1rem' }}
        bg={active ? $colors.bg : 'transparent'}
        _hover={{
          '&>div': {
            color: $colors.hover,
          },
          '&::before': {
            position: 'absolute',
            left: '4.25rem',
            content: '""',
            width: 0,
            height: 0,
            border: '0.625rem solid transparent',
            borderRightColor: $colors.borderRightColor,
            display: { base: 'flex', sm: 'none' },
          },
          '&::after': {
            content: `"${label}"`,
            borderRadius: '0.25rem',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            display: { base: 'flex', sm: 'none' },
            left: '5.5rem',
            bg: $colors.afterBg,
            color: $colors.afterColor,
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
        <Icon fill={$colors.iconColor} style={{ minWidth: '1.5rem' }} />
        <Flex
          flexDirection="row"
          paddingLeft="1rem"
          fontSize="0.875rem"
          color={active ? $colors.activeFontColor : $colors.fontColor}
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
