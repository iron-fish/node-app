import { Flex, Image, NAMED_COLORS, useColorModeValue } from '@ironfish/ui-kit'
import ThemeToggle from 'Components/ThemeToggle'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'

const Layout: FC = () => {
  const colors = useColorModeValue(
    {
      color: NAMED_COLORS.GREY,
      bg: NAMED_COLORS.WHITE,
    },
    {
      color: NAMED_COLORS.LIGHTER_GREY,
      bg: NAMED_COLORS.BLACK,
    }
  )
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
        bg={colors.bg}
        maxWidth="45.25rem"
      >
        <Outlet />
        <Flex
          w="100%"
          h="3.25rem"
          borderTop={`0.0625rem solid ${colors.color}`}
          px="4rem"
          py="0.5rem"
          justifyContent="space-between"
          bg={colors.bg}
          marginTop="auto"
        >
          <a href="https://discord.gg/ironfish">
            <span>Need Help? Find us on Discord</span>
          </a>
          <ThemeToggle />
        </Flex>
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
