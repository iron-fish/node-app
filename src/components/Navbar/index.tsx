import {
  chakra,
  Flex,
  NAMED_COLORS as C,
  Box,
  BoxProps,
  useColorModeValue,
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
import HexFishLogo from 'Svgx/hexfish'
import { FC } from 'react'

const primaryNavItems = [
  { hotkey: 'A', to: '/accounts', label: 'Privacy Accounts', icon: IconHome },
  { hotkey: 'S', to: '/send', label: 'Send $IRON', icon: IconSend },
  { hotkey: 'R', to: '/receive', label: 'Receive $IRON', icon: IconReceive },
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

const ActiveStats: FC<BoxProps> = props => {
  const colors = useColorModeValue(
    {
      text: '#335A48',
      bg: '#EBFBF4',
    },
    {
      text: '#5FC89A',
      bg: '#192D23',
    }
  )
  return (
    <Box mt="1rem" mb="1.5rem" {...props}>
      <Box
        my="0.5rem"
        p="0.25rem"
        bg={colors.bg}
        borderRadius="0.25rem"
        textAlign="center"
      >
        <chakra.h5 color={colors.text}>Wallet Status: Synced</chakra.h5>
      </Box>
      <Box
        my="0.5rem"
        p="0.25rem"
        bg={colors.bg}
        borderRadius="0.25rem"
        textAlign="center"
      >
        <chakra.h5 color={colors.text}>Miner Running: 300 h/s</chakra.h5>
      </Box>
    </Box>
  )
}

export const Navbar = () => {
  const bgColor = useColorModeValue(C.WHITE, C.BLACK)
  return (
    <Flex
      bg={bgColor}
      height="100%"
      maxHeight="100vh"
      p="3rem 1rem 1rem"
      w={{ base: '5.5rem', sm: '16.4375rem' }}
      transition="width 0.3s ease-out"
      position="fixed"
      left="0"
      top="0"
      flexDirection="column"
      alignItems="start"
      zIndex={100}
    >
      <IronFishLogo
        m="0.5rem 1rem"
        display={{ base: 'none', sm: 'inline-block' }}
      />
      <HexFishLogo
        m="0.5rem 1rem"
        display={{ base: 'inline-block', sm: 'none' }}
      />
      <Box mt="2rem">
        <Nav list={primaryNavItems} />
      </Box>
      <Box marginTop="auto">
        <Nav my="1rem" list={secondaryNavItems} />
        <ActiveStats display={{ base: 'none', sm: 'block' }} />
        <Toggle />
      </Box>
    </Flex>
  )
}

export default Navbar
