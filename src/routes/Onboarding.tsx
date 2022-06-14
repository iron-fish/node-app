import {
  Button,
  chakra,
  Box,
  NAMED_COLORS as C,
  Flex,
  useColorMode,
  useColorModeValue,
  ColorModeSwitcher as Toggle,
} from '@ironfish/ui-kit'

import Logo from 'src/svgx/Logo'

export const Onboarding = () => {
  const { colorMode } = useColorMode()
  const color = useColorModeValue(
    { base: C.WHITE, border: C.LIGHTER_GREY, highlight: C.BLACK },
    { base: C.BLACK, border: C.GREY, highlight: C.YELLOW }
  )
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
        bg={color.base}
        maxWidth="45.25rem"
      >
        <Flex flexDirection="column" p="4rem" pb="0" bg="transparent">
          <Logo fill={color.highlight} />
          <chakra.h1 mt="4rem" mb="2rem">
            Iron Fish Wallet
          </chakra.h1>
          <Box
            p="2rem"
            layerStyle="card"
            w="100%"
            maxWidth="36.75rem"
            mb="20px"
          >
            <h2>Create Account</h2>
            <p>
              Choose this option if you don't have an existing Iron Fish account
              or if you'd like to create a new one.
            </p>
            <Button size="medium" variant="primary" mt="1rem">
              Create Account
            </Button>
          </Box>
          <Box p="2rem" layerStyle="card" w="100%" maxWidth="36.75rem">
            <h2>Import Account</h2>
            <p>
              Already have an account? Enter your recovery credentials and
              continue using your account.
            </p>
            <Button size="medium" variant="primary" mt="1rem">
              Import Account
            </Button>
          </Box>
        </Flex>
        <Flex
          w="100%"
          h="3.25rem"
          borderTop={`1px solid ${color.border}`}
          px="4rem"
          py="0.5rem"
          justifyContent="space-between"
          bg={color.base}
        >
          <a href="https://discord.gg/ironfish">
            <span>Need Help? Find us on Discord</span>
          </a>
          <Toggle />
        </Flex>
      </Flex>
      <chakra.img
        position="absolute"
        right="0"
        src="/images/onboarding.png"
        height="1024"
      />
    </Flex>
  )
}

export default Onboarding
