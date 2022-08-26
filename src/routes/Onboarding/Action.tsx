import { Box, Button, Flex, chakra, NAMED_COLORS } from '@ironfish/ui-kit'
import { Link } from 'react-router-dom'

import Logo from 'Svgx/Logo'
import { ROUTES } from '..'

export const Onboarding = () => {
  return (
    <Flex flexDirection="column" p="4rem" pb="0" bg="transparent">
      <Logo mt={{ base: 0, sm: '2rem' }} mb="4rem" color={NAMED_COLORS.BLACK} />
      <chakra.h1 mb="2rem" color={NAMED_COLORS.BLACK}>
        Iron Fish Wallet
      </chakra.h1>
      <Box
        p="2rem"
        layerStyle="card"
        w="100%"
        maxWidth="36.75rem"
        mb="2rem"
        bg={`${NAMED_COLORS.WHITE} !important`}
        boxShadow={`0.25rem 0.25rem 0 -0.063rem ${NAMED_COLORS.WHITE}, 0.25rem 0.25rem ${NAMED_COLORS.LIGHT_GREY} !important`}
        borderColor={`${NAMED_COLORS.LIGHT_GREY} !important`}
      >
        <chakra.h3 pb="0.75rem" color={NAMED_COLORS.BLACK}>
          Create Account
        </chakra.h3>
        <chakra.h5 color={NAMED_COLORS.GREY}>
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
      <Box
        p="2rem"
        layerStyle="card"
        w="100%"
        maxWidth="36.75rem"
        bg={`${NAMED_COLORS.WHITE} !important`}
        boxShadow={`0.25rem 0.25rem 0 -0.063rem ${NAMED_COLORS.WHITE}, 0.25rem 0.25rem ${NAMED_COLORS.LIGHT_GREY} !important`}
        borderColor={`${NAMED_COLORS.LIGHT_GREY} !important`}
      >
        <chakra.h3 pb="0.75rem" color={NAMED_COLORS.BLACK}>
          Import Account
        </chakra.h3>
        <chakra.h5 color={NAMED_COLORS.GREY}>
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
