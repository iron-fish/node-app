import { FC } from 'react'
import { Flex, NAMED_COLORS, useColorModeValue, Icon } from '@ironfish/ui-kit'
import Hotkey from 'Components/Hotkey'

export type NavItemProps = {
  active?: boolean
  to: string
  label: string
  icon: typeof Icon
  hotkey: string
  aliases: string[]
}

export const NavItem: FC<Omit<NavItemProps, 'aliases'>> = ({
  active,
  label,
  icon,
  hotkey,
}) => {
  const ItemIcon = icon as typeof Icon
  const $colors = useColorModeValue(
    {
      borderRightColor: NAMED_COLORS.BLACK,
      afterColor: NAMED_COLORS.WHITE,
      afterBg: NAMED_COLORS.BLACK,
    },
    {
      borderRightColor: NAMED_COLORS.WHITE,
      afterColor: NAMED_COLORS.BLACK,
      afterBg: NAMED_COLORS.WHITE,
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
        bg={active ? NAMED_COLORS.LIGHTER_GREY : 'transparent'}
        _dark={{
          bg: active ? NAMED_COLORS.DARK_GREY : 'transparent',
        }}
        _hover={{
          '&>div': {
            color: NAMED_COLORS.DEEP_BLUE,
            _dark: {
              color: NAMED_COLORS.WHITE,
            },
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
        <ItemIcon
          fill={NAMED_COLORS.BLACK}
          _dark={{
            fill: NAMED_COLORS.WHITE,
          }}
          style={{ minWidth: '1.5rem' }}
        />
        <Flex
          flexDirection="row"
          paddingLeft="1rem"
          fontSize="0.875rem"
          color={active ? NAMED_COLORS.BLACK : NAMED_COLORS.GREY}
          _dark={{
            color: active ? NAMED_COLORS.WHITE : NAMED_COLORS.PALE_GREY,
          }}
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
