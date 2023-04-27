import { Box, Button, Flex, chakra, NAMED_COLORS } from '@ironfish/ui-kit'
import { Link } from 'react-router-dom'

import Logo from 'Svgx/Logo'
import { ROUTES } from '..'
import { LightMode } from '@ironfish/ui-kit'
import { Card } from '@ironfish/ui-kit'
import { CardBody } from '@ironfish/ui-kit'

export const Onboarding = () => {
  return (
    <LightMode>
      <Flex flexDirection="column" p="4rem" pb="0" bg="transparent">
        <Logo
          mt={{ base: 0, sm: '2rem' }}
          mb="4rem"
          color={NAMED_COLORS.BLACK}
        />
        <chakra.h1 mb="1rem" color={NAMED_COLORS.BLACK}>
          Iron Fish Wallet
        </chakra.h1>
        <Card
          variant="ironFish"
          p="2rem"
          w="100%"
          maxWidth="36.75rem"
          mb="2rem"
        >
          <CardBody>
            <chakra.h3 pb="0.75rem" color={NAMED_COLORS.BLACK}>
              Create Account
            </chakra.h3>
            <chakra.h5 color={NAMED_COLORS.GREY}>
              Choose this option if you don't have an existing Iron Fish account
              or if you'd like to create a new one.
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
          </CardBody>
        </Card>
        <Card variant="ironFish" p="2rem" w="100%" maxWidth="36.75rem">
          <CardBody>
            <chakra.h3 pb="0.75rem" color={NAMED_COLORS.BLACK}>
              Import Account
            </chakra.h3>
            <chakra.h5 color={NAMED_COLORS.GREY}>
              Already have an account? Enter your recovery credentials and
              continue using your account.
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
          </CardBody>
        </Card>
      </Flex>
    </LightMode>
  )
}

export default Onboarding
