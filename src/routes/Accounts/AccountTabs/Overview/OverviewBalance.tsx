import { FC, useEffect } from 'react'
import { Box, Button, chakra, Flex, Icon, NAMED_COLORS } from '@ironfish/ui-kit'
import SendIcon from 'Svgx/send'
import Receive from 'Svgx/receive'
import FeesImage from 'Svgx/FeesImage'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'Routes/data'
import { useDataSync } from 'Providers/DataSyncProvider'
import Account from 'Types/Account'
import { accountGradientByOrder } from 'Utils/accountGradientByOrder'
import { formatOreToTronWithLanguage } from 'Utils/number'
import useAccountBalance from 'Hooks/accounts/useAccountBalance'

interface OverviewBalanceProps {
  account: Account
}

const OverviewBalance: FC<OverviewBalanceProps> = ({ account }) => {
  const [{ data: balance, loaded: balanceLoaded }, reloadBalance] =
    useAccountBalance(account?.id)

  useEffect(() => {
    let interval: NodeJS.Timer
    if (balanceLoaded) {
      interval = setInterval(reloadBalance, 5000)
    }

    return () => interval && clearInterval(interval)
  }, [balanceLoaded])

  const navigate = useNavigate()
  const { synced } = useDataSync()
  return (
    <Flex w="100%" pb="2rem">
      <Box
        layerStyle="card"
        bg={`${accountGradientByOrder(account.order)} !important`}
        borderRadius="0.25rem"
        w="100%"
        minWidth="18rem"
        mr="1rem"
        ml="0rem"
        mt="0rem"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Box m="2rem">
            <Box>
              <chakra.h4 color={NAMED_COLORS.DEEP_BLUE}>$IRON</chakra.h4>
            </Box>
            <Box mb="0.5rem">
              <chakra.h2 color={NAMED_COLORS.DEEP_BLUE}>
                {formatOreToTronWithLanguage(balance?.confirmed || BigInt(0))}
              </chakra.h2>
            </Box>
            <Flex gap="1rem">
              <Button
                variant="primary"
                borderRadius="4rem"
                borderColor="transparent"
                leftIcon={
                  <Icon height={8}>
                    <SendIcon />
                  </Icon>
                }
                onClick={() =>
                  navigate(ROUTES.SEND, {
                    state: { accountId: account.id },
                  })
                }
                isDisabled={!synced}
                disabled={!synced}
              >
                <h5>Send</h5>
              </Button>
              <Button
                variant="primary"
                borderRadius="4rem"
                borderColor="transparent"
                leftIcon={
                  <Icon height={8}>
                    <Receive />
                  </Icon>
                }
                onClick={() =>
                  navigate(ROUTES.RECEIVE, {
                    state: { accountId: account.id },
                  })
                }
                isDisabled={!synced}
                disabled={!synced}
              >
                <h5>Receive</h5>
              </Button>
            </Flex>
          </Box>
          <Box display={{ base: 'none', md: 'inline-block' }} m="1rem">
            <FeesImage width={180} height={133} />
          </Box>
        </Flex>
      </Box>
      <Box
        layerStyle="card"
        p="2rem"
        borderRadius="0.25rem"
        minWidth="17.5rem"
        mt="0rem"
      >
        <Box>
          <chakra.h4>Pending $IRON</chakra.h4>
        </Box>
        <Box mb="0.5rem">
          <chakra.h2>
            {formatOreToTronWithLanguage(balance?.unconfirmed || BigInt(0))}
          </chakra.h2>
        </Box>
      </Box>
    </Flex>
  )
}

export default OverviewBalance
