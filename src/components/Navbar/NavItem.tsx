import { FC, ReactNode } from 'react'
import { Flex, NAMED_COLORS, Box, Tooltip, Icon } from '@ironfish/ui-kit'
import Hotkey from 'Components/Hotkey'

export type NavItemProps = {
  active?: boolean
  to: string
  label: string
  icon: typeof Icon
  hotkey?: string
  aliases: string[]
  statItem?: ReactNode
}

export const NavItem: FC<Omit<NavItemProps, 'aliases'>> = ({
  active,
  label,
  icon,
  hotkey,
  statItem,
}) => {
  const ItemIcon = icon as typeof Icon
  return (
    <>
      <Tooltip
        placement="right"
        bg={NAMED_COLORS.DEEP_BLUE}
        _dark={{
          bg: NAMED_COLORS.WHITE,
          '--popper-arrow-bg': NAMED_COLORS.WHITE,
        }}
        boxShadow="none"
        p={'0.5rem 0.75rem'}
        m={0}
        hasArrow={true}
        label={label}
        borderRadius="0.25rem"
        height="2.5rem"
        maxW={'8rem'}
        display={{ base: 'flex', sm: 'none' }}
        alignItems="center"
        arrowSize={12.6}
        offset={[0, 16]}
      >
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
            {!statItem && hotkey && active && <Hotkey>{hotkey}</Hotkey>}
            {statItem && <Box mr="0.5rem">{statItem}</Box>}
          </Flex>
        </Flex>
      </Tooltip>
    </>
  )
}

export default NavItem
