import { Flex, Box, Image, LightMode, NAMED_COLORS } from '@ironfish/ui-kit'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'

const Layout: FC = () => {
  return (
    <Flex
      flexDirection="column"
      className="App__onboarding"
      bg="transparent"
      overflow="hidden"
      height="100%"
      minHeight="100vh"
      sx={{
        backgroundSize: 'auto 150%',
        backgroundPositionX: 'right',
        background:
          'url(/images/onboarding_fish.png) no-repeat center center fixed',
      }}
    >
      <Flex
        zIndex="100"
        position="absolute"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="space-between"
        height="100%"
        minHeight="100vh"
        width="100%"
        bg={NAMED_COLORS.WHITE}
        maxWidth="45.25rem"
      >
        <LightMode>
          <Outlet />
          <Box w="100%" h="52px" marginTop="auto" />
        </LightMode>
      </Flex>
      {/* <Image
        position="absolute"
        w="100%"
        h="100%"
        autoCapitalize="true"
        src="/images/onboarding_fish.png"
      /> */}
    </Flex>
  )
}

export default Layout
