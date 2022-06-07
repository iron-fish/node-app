import { Flex, useColorMode, NAMED_COLORS as C } from '@ironfish/ui-kit'

import IconHome from 'src/svgx/home'
import IconSend from 'src/svgx/send'
import IconReceive from 'src/svgx/receive'
import IconAddressBook from 'src/svgx/address-book'
import IconResources from 'src/svgx/lightbulb'
import IconNode from 'src/svgx/node'
import IconMiner from 'src/svgx/hammer'
import Toggle from 'src/components/ThemeToggle'

import Nav from './Nav'

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

const ActiveStats = () => <div />

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
      position="absolute"
      left="0"
      top="0"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <Nav list={primaryNavItems} />
      <Nav list={secondaryNavItems} />
      <ActiveStats />
      <Toggle />
    </Flex>
  )
}

export default Navbar
