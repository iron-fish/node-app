import {
  Box,
  Button,
  Flex,
  chakra,
  useColorModeValue,
  NAMED_COLORS,
} from '@ironfish/ui-kit'
import { Link } from 'react-router-dom'

import Logo from 'Svgx/Logo'
import { ROUTES } from '..'

export const Onboarding = () => {
  const textColor = useColorModeValue(
    NAMED_COLORS.GREY,
    NAMED_COLORS.LIGHTER_GREY
  )
  return (
    <Flex flexDirection="column" p="4rem" pb="0" bg="transparent">
      <Logo />
      <chakra.h1>Iron Fish Wallet</chakra.h1>
      <Box p="2rem" layerStyle="card" w="100%" maxWidth="36.75rem" mb="2rem">
        <chakra.h2>Create Account</chakra.h2>
        <chakra.h5 color={textColor}>
          Choose this option if you don't have an existing Iron Fish account or
          if you'd like to create a new one.
        </chakra.h5>
        <Button
          mt="1rem"
          variant="primary"
          borderRadius="4rem"
          as={Link}
          to={ROUTES.CREATE}
        >
          Create Account
        </Button>
      </Box>
      <Box p="2rem" layerStyle="card" w="100%" maxWidth="36.75rem">
        <chakra.h2>Import Account</chakra.h2>
        <chakra.h5 color={textColor}>
          Already have an account? Enter your recovery credentials and continue
          using your account.
        </chakra.h5>
        <Button
          mt="1rem"
          variant="primary"
          borderRadius="4rem"
          as={Link}
          to={ROUTES.IMPORT}
        >
          Import Account
        </Button>
      </Box>
    </Flex>
  )
}

export default Onboarding
