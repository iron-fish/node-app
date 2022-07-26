import { Flex, Image, NAMED_COLORS, useColorModeValue } from "@ironfish/ui-kit"
import ThemeToggle from "Components/ThemeToggle"
import { FC } from "react"
import { Outlet } from "react-router-dom"

const Layout: FC = () => {
  const color = useColorModeValue(NAMED_COLORS.GREY, NAMED_COLORS.LIGHTER_GREY)
  return (
    <Flex
      flexDirection="column"
      className="App__onboarding"
      bg="transparent"
      overflow="hidden"
      height="100%"
      minHeight="100vh"
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
        bg="white"
        maxWidth="45.25rem"
      >
        <Outlet />
        <Flex
          w="100%"
          h="3.25rem"
          borderTop={`1px solid ${color}`}
          px="4rem"
          py="0.5rem"
          justifyContent="space-between"
          bg="white"
          marginTop="auto"
        >
          <a href="https://discord.gg/ironfish">
            <span>Need Help? Find us on Discord</span>
          </a>
          <ThemeToggle />
        </Flex>
      </Flex>
      <Image
        position="absolute"
        w="100%"
        h="100%"
        autoCapitalize="true"
        src="/images/onboarding.png"
        backgroundSize="contain"
      />
    </Flex>
  )
}

export default Layout
