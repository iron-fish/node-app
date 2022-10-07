import { Flex, Box, chakra, useBreakpointValue, Link } from '@ironfish/ui-kit'
import { FC, useState, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { useDataSync } from 'Providers/DataSyncProvider'

import Navbar from '../components/Navbar'
import CloseIcon from 'Svgx/CloseIcon'

export const PageLayout: FC = () => {
  const [hideSync, setHideSync] = useState(false)
  const { loaded } = useDataSync()
  const message = useBreakpointValue({
    base: 'Account balances might not be accurate while your wallet syncs.',
    sm: 'Account balances might not be accurate while your wallet syncs and certain functions may not be available.',
  })

  const hideSynchWarning = useMemo(() => hideSync || loaded, [hideSync, loaded])
  const warningHeight = hideSynchWarning ? 0 : 2.625

  return (
    <>
      <Flex
        h={`${warningHeight}rem`}
        backgroundColor="#FFF9BC"
        width="100%"
        alignItems="center"
        justifyContent="center"
        transition="height 0.3s ease-in-out"
      >
        <chakra.h5
          ml="auto"
          color="#7E7400"
          display={hideSynchWarning ? 'none' : 'block'}
        >
          {message}&nbsp;
          <Link color="inherit">
            <b>Learn More.</b>
          </Link>
        </chakra.h5>
        <CloseIcon
          display={hideSynchWarning ? 'none' : 'block'}
          ml="auto"
          mr="1rem"
          color="#7E7400"
          width="0.5625rem"
          height="0.5625rem"
          cursor="pointer"
          onClick={() => setHideSync(true)}
        />
      </Flex>
      <Flex
        top="0"
        className="App"
        justifyContent="center"
        minHeight={`calc(100vh - ${warningHeight}rem)`}
        transition="min-height 0.3s ease-in-out"
      >
        <Navbar offsetTop={warningHeight} />
        <Box marginLeft={{ base: '6rem', sm: '17rem' }} w="100%">
          <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            px="2rem"
            py="2.5rem"
          >
            <Box width="100%" height="100%" maxWidth="65.5rem">
              <Outlet />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

export default PageLayout
