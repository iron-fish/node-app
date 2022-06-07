import { FC, ReactType, useState } from 'react'
import {
  Flex,
  chakra,
  List,
  ListItem,
  useColorMode,
  NAMED_COLORS,
  Box,
} from '@ironfish/ui-kit'
import IconHome from 'src/svgx/home'
import IconSend from 'src/svgx/send'
import IconReceive from 'src/svgx/receive'
import IconAddressBook from 'src/svgx/address-book'
import { SVGProps } from 'src/svgx/types'
import Toggle from 'src/components/ThemeToggle'

const Hotkey = ({ children }) => {
  const { colorMode } = useColorMode()
  const isLightMode = colorMode === 'light'
  return (
    <Flex
      w="1.5rem"
      h="1.5rem"
      textAlign="center"
      justifyContent="center"
      alignItems="center"
      borderRadius="2px"
      bg={isLightMode ? NAMED_COLORS.LIGHT_GREY : NAMED_COLORS.DARKER_GREY}
    >
      {children}
    </Flex>
  )
}

type NavButtonProps = {
  active: boolean
  to: string
  label: string
  icon: ReactType
  hotkey: string
}

const NavButton: FC<NavButtonProps> = ({ active, label, icon, hotkey }) => {
  const { colorMode } = useColorMode()
  const [$hover, $setHover] = useState(false)
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
          $hover
            ? isLightMode
              ? NAMED_COLORS.LIGHTER_GREY
              : NAMED_COLORS.DARK_GREY
            : 'transparent'
        }
        cursor="pointer"
        onMouseOver={() => $setHover(true)}
        onMouseOut={() => $setHover(false)}
      >
        <Icon fill={isLightMode ? NAMED_COLORS.BLACK : NAMED_COLORS.WHITE} />
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
          {(active || $hover) && <Hotkey>{hotkey}</Hotkey>}
        </Flex>
        {$hover && (
          <Flex
            borderRadius="4px"
            position="absolute"
            justifyContent="center"
            alignItems="center"
            display={{ base: 'flex', sm: 'none' }}
            left="5.5rem"
            bg={isLightMode ? 'black' : 'white'}
            color={isLightMode ? 'white' : 'black'}
            height="2.5rem"
            maxWidth="8rem"
            whiteSpace="nowrap"
            padding="0.5rem 0.75rem"
            fontSize="0.75rem"
            fontFamily="favorit-regular"
            _before={{
              display: 'inline-block',
              position: 'absolute',
              top: '10px',
              left: '-20px',
              content: '""',
              width: 0,
              height: 0,
              border: '10px solid transparent',
              borderRightColor: isLightMode ? 'black' : 'white',
            }}
          >
            {label}
          </Flex>
        )}
      </Flex>
    </>
  )
}

const primaryNavItems = [
  { hotkey: 'A', to: '/accounts', label: 'Privacy Accounts', icon: IconHome },
  { hotkey: 'S', to: '/send', label: 'Send $', icon: IconSend },
  { hotkey: 'R', to: '/receive', label: 'Receive $', icon: IconReceive },
  {
    hotkey: 'B',
    to: '/address-book',
    label: 'Address Book',
    icon: IconAddressBook,
  },
]

const PrimaryNav = () => (
  <chakra.nav>
    <List spacing={3} maxWidth="16.5rem">
      {primaryNavItems.map(({ to, label, icon, hotkey }, index) => (
        <ListItem key={to}>
          <NavButton
            to={to}
            label={label}
            icon={icon}
            hotkey={hotkey}
            active={index === 0}
          />
        </ListItem>
      ))}
    </List>
  </chakra.nav>
)
const SecondaryNav = () => <div />
const ActiveStats = () => <div />

export const Navbar = () => {
  return (
    <Flex
      bg="white"
      height="100%"
      maxHeight="100vh"
      p="1rem"
      w={{ base: '88px', sm: '263px' }}
      position="absolute"
      left="0"
      top="0"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <PrimaryNav />
      <SecondaryNav />
      <ActiveStats />
      <Toggle />
    </Flex>
  )
}

export default Navbar
