import { FC, useEffect, useMemo, useState } from 'react'
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
// const secondaryNavItems = [
//   {
//     hotkey: 'U',
//     to: ROUTES.UPDATES,
//     label: 'Updates',
//     icon: Updates,
//     aliases: [ROUTES.ACCOUNT, ROUTES.TRANSACTION],
//   },
//   //   { hotkey: 'I', to: '/resources', label: 'Resources', icon: IconResources },
//   //   { hotkey: 'M', to: '/miner', label: 'Miner', icon: IconMiner },
// ]

export const Navbar: FC<FlexProps> = props => {
  const { data: updatesCount, loaded } = useUpdatesCount()

  const secondaryNavItems = useMemo(() => {
    return [
      {
        statItem:
          loaded && updatesCount > 0 ? (
            <Box
              w="18px"
              h="18px"
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
        aliases: [ROUTES.ACCOUNT, ROUTES.TRANSACTION],
      },
    ]
  }, [updatesCount, loaded])

  return (
    <Flex
      bg="inherit"
      height="100%"
      maxHeight="100vh"
      p="3rem 1rem 1rem"
      w={{ base: '5.5rem', sm: '16.4375rem' }}
      transition="width 0.3s ease-in-out"
      position="sticky"
      left="0"
      top="0"
      flexDirection="column"
      alignItems="start"
      zIndex={100}
      {...props}
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
        <Nav mb="1rem" list={secondaryNavItems} />
        <StatusBar />
        <Toggle />
      </Box>
    </Flex>
  )
}

export default Navbar
