import { FC, useMemo } from 'react'
import { Flex, Box, FlexProps, NAMED_COLORS } from '@ironfish/ui-kit'

import IconHome from 'Svgx/home'
import IconSend from 'Svgx/send'
import IconReceive from 'Svgx/receive'
import IconAddressBook from 'Svgx/address-book'
import IconNode from 'Svgx/node'
import Toggle from 'Components/ThemeToggle'
// import IconResources from 'Svgx/lightbulb'
// import IconMiner from 'Svgx/hammer'

import Nav from './Nav'
import IronFishLogo from 'Svgx/IronFishLogo'
import HexFishLogo from 'Svgx/hexfish'

import StatusBar from './StatusBar'
import ROUTES from 'Routes/data'
import { NavItemProps } from './NavItem'
import Updates from 'Svgx/Updates'
import useUpdatesCount from 'Hooks/updates/useUpdatesCount'

const primaryNavItems: NavItemProps[] = [
  {
    hotkey: 'A',
    to: ROUTES.ACCOUNTS,
    label: 'Privacy Accounts',
    icon: IconHome,
    aliases: [ROUTES.ACCOUNT, ROUTES.TRANSACTION],
  },
  {
    hotkey: 'S',
    to: ROUTES.SEND,
    label: 'Send',
    icon: IconSend,
    aliases: [],
  },
  {
    hotkey: 'R',
    to: ROUTES.RECEIVE,
    label: 'Receive',
    icon: IconReceive,
    aliases: [],
  },
  {
    hotkey: 'B',
    to: ROUTES.ADDRESS_BOOK,
    label: 'Address Book',
    icon: IconAddressBook,
    aliases: [ROUTES.ADDRESS_BOOK_DETAILS],
  },
  {
    hotkey: 'N',
    to: ROUTES.NODE,
    label: 'Your Node',
    icon: IconNode,
    aliases: [],
  },
]

export const Navbar: FC<FlexProps> = props => {
  const { data: updatesCount, loaded } = useUpdatesCount()
  const isOpen = useBreakpointValue({ base: false, sm: true })
  const secondaryNavItems = useMemo(() => {
    return [
      {
        statItem:
          loaded && updatesCount > 0 ? (
            <Box
              w="1.125rem"
              h="1.125rem"
              borderRadius="50%"
              textAlign="center"
              bgColor="#335A48"
              color={NAMED_COLORS.WHITE}
              _dark={{
                bgColor: '#5FC89A',
                color: NAMED_COLORS.BLACK,
              }}
            >
              <h6>{updatesCount}</h6>
            </Box>
          ) : null,
        to: ROUTES.UPDATES,
        label: 'Updates',
        icon: Updates,
        aliases: [],
      },
    ]
  }, [updatesCount, loaded])

  return (
    <Flex
      bg="inherit"
      height="100%"
      maxHeight="100vh"
      p="3rem 1rem 1rem"
      w={isOpen ? '16.4375rem' : '5.5rem'}
      transition="width 0.5s ease-in-out"
      position="sticky"
      left="0"
      top="0"
      flexDirection="column"
      alignItems="start"
      zIndex={100}
      {...props}
    >
      <Flex>
        <HexFishLogo m="0.5rem 1rem" mr={0} />
        <Box
          w={isOpen ? '10.3125rem' : '0'}
          transition="width 0.5s ease-in-out"
          overflow="hidden"
        >
          <IronFishLogo m="0.5rem 1rem" ml="-1.8125rem" />
        </Box>
      </Flex>
      <Box mt="2rem">
        <Nav list={primaryNavItems} />
      </Box>
      <Flex marginTop="auto" direction="column" alignItems="center">
        <Nav mb="1rem" list={secondaryNavItems} />
        <StatusBar />
        <Toggle />
      </Flex>
    </Flex>
  )
}

export default Navbar
