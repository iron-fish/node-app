import {
  Flex,
  useColorMode,
  NAMED_COLORS as C,
  Box,
  BoxProps,
} from '@ironfish/ui-kit'

import IconHome from 'Svgx/home'
import IconSend from 'Svgx/send'
import IconReceive from 'Svgx/receive'
import IconAddressBook from 'Svgx/address-book'
import IconResources from 'Svgx/lightbulb'
import IconNode from 'Svgx/node'
import IconMiner from 'Svgx/hammer'
import Toggle from 'Components/ThemeToggle'

import Nav from './Nav'
import IronFishLogo from 'Svgx/IronFishLogo'
import { FC } from 'react'

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
const secondaryNavItems = [
  { hotkey: 'I', to: '/resources', label: 'Resources', icon: IconResources },
  { hotkey: 'N', to: '/node', label: 'Your Node', icon: IconNode },
  { hotkey: 'M', to: '/miner', label: 'Miner', icon: IconMiner },
]

const ActiveStats: FC<BoxProps> = props => <Box {...props} />

export const Navbar = () => {
  const { colorMode } = useColorMode()
  const isLightMode = colorMode === 'light'
  return (
    <Flex
      bg={isLightMode ? C.WHITE : C.BLACK}
      height="100%"
      maxHeight="100vh"
      p="1rem"
      w={{ base: '88px', sm: '263px' }}
      transition="width 0.3s ease-out"
      position="fixed"
      left="0"
      top="0"
      flexDirection="column"
      alignItems="start"
      zIndex={100}
    >
      <IronFishLogo m="0.5rem" />
      <Box mt="2rem">
        <Nav list={primaryNavItems} />
      </Box>
      <Box marginTop="auto">
        <Nav my="1rem" list={secondaryNavItems} />
        <ActiveStats />
        <Toggle />
      </Box>
    </Flex>
  )
}

export default Navbar
