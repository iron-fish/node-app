import {
  Box,
  NAMED_COLORS as C,
  Flex,
  useColorModeValue,
  Image,
} from '@ironfish/ui-kit'
import Toggle from 'Components/ThemeToggle'
import { Link } from 'react-router-dom'

import Logo from 'Svgx/Logo'
import ROUTES from './data'

export const Onboarding = () => {
  const color = useColorModeValue(C.GREY, C.LIGHTER_GREY)
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
        <Flex flexDirection="column" p="4rem" pb="0" bg="transparent">
          <Logo />
          <h1>Iron Fish Wallet</h1>
          <Box
            p="2rem"
            layerStyle="card"
            w="100%"
            maxWidth="36.75rem"
            cursor="pointer"
          >
            <Link to={ROUTES.ACCOUNTS}>
              <h2>Create Account</h2>
              <p>
                Choose this option if you don't have an existing Iron Fish
                account or if you'd like to create a new one.
              </p>
            </Link>
          </Box>
          <Box
            p="2rem"
            layerStyle="card"
            w="100%"
            maxWidth="36.75rem"
            cursor="pointer"
          >
            <Link to={ROUTES.ACCOUNTS}>
              <h2>Import Account</h2>
              <p>
                Already have an account? Enter your recovery credentials and
                continue using your account.
              </p>
            </Link>
          </Box>
        </Flex>
        <Flex
          w="100%"
          h="3.25rem"
          borderTop={`1px solid ${color}`}
          px="4rem"
          py="0.5rem"
          justifyContent="space-between"
          bg="white"
        >
          <a href="https://discord.gg/ironfish">
            <span>Need Help? Find us on Discord</span>
          </a>
          <Toggle />
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

export default Onboarding
