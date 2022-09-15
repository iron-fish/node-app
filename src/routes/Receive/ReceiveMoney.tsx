import { FC, memo, useState, useEffect, useMemo } from 'react'
import {
  Box,
  Flex,
  chakra,
  useColorModeValue,
  NAMED_COLORS,
  Button,
  SelectField,
  TextField,
  FieldGroup,
  Skeleton,
} from '@ironfish/ui-kit'
import { QRCodeSVG } from 'qrcode.react'
import { useLocation } from 'react-router-dom'
import DetailsPanel from 'Components/DetailsPanel'
import AccountSettingsImage from 'Svgx/AccountSettingsImage'
import LinkLaunchIcon from 'Svgx/LinkLaunch'
import IconCopy from '@ironfish/ui-kit/dist/svgx/icon-copy'
import useAccounts from 'Hooks/accounts/useAccounts'
import { Account } from 'Data/types/Account'
import LocationStateProps from 'Types/LocationState'

const Information: FC = memo(() => {
  const textColor = useColorModeValue(
    NAMED_COLORS.GREY,
    NAMED_COLORS.LIGHT_GREY
  )
  return (
    <Box maxWidth="21.5rem">
      <chakra.h3 mb="1rem">Use our block explorer</chakra.h3>
      <chakra.h5 mb="2rem" color={textColor}>
        Want to ensure your receipient, or yourself, that a transaction has been
        sent? Request a transaction link from the iron fish block explorer!
        <br />
        <br />
        <Button
          variant="link"
          color={NAMED_COLORS.LIGHT_BLUE}
          rightIcon={<LinkLaunchIcon h="0.875rem" w="0.875rem" />}
          onClick={() => window.open('https://explorer.ironfish.network/')}
        >
          <chakra.h5>Check it out!</chakra.h5>
        </Button>
      </chakra.h5>
      <AccountSettingsImage />
    </Box>
  )
})

const getAccountOptions = (accounts: Account[] = []) =>
  accounts.map((account: Account) => ({
    label: account.name,
    helperText: `${account.balance} $IRON`,
    value: account.address,
  }))

const ReceiveMoney: FC = () => {
  const location = useLocation()
  const state = location.state as LocationStateProps
  const { data: accounts, loaded: accountsLoaded } = useAccounts()
  const [account, setAccount] = useState(null)
  // const [amount, setAmount] = useState(0)

  const accountOptions = useMemo(
    () => getAccountOptions(accounts),
    [JSON.stringify(accounts)]
  )

  useEffect(() => {
    if (accountsLoaded) {
      const selectedAccount =
        state && accountOptions.find(({ value }) => value === state.accountId)
      setAccount(selectedAccount ? selectedAccount : accountOptions[0])
    }
  }, [accountsLoaded])

  return (
    <>
      <chakra.h2 mb="1rem">Receive $IRON</chakra.h2>
      <Flex mb="4rem">
        <Box w="37.25rem">
          {accountsLoaded ? (
            <SelectField
              label="Account"
              value={account}
              options={accountOptions}
              onSelectOption={setAccount}
              mb="1rem"
            />
          ) : (
            <Skeleton
              w="100%"
              h="70px"
              mb="2rem"
              borderRadius="4px"
              startColor={NAMED_COLORS.PALE_GREY}
              endColor={NAMED_COLORS.LIGHT_GREY}
            />
          )}
          {/* Hide amount field while not clarified, should be removed or enabled when with API connection
           <TextField
            label="Amount"
            value={amount.toFixed(2)}
            InputProps={{
              type: 'number',
              onChange: e => setAmount(Number.parseFloat(e.target.value)),
            }}
            mb="1rem"
          /> */}
          <Box mr="0.25rem">
            <Flex
              layerStyle="card"
              w="100%"
              p="4rem"
              direction="column"
              alignItems="center"
              ml={0}
            >
              <Box mb="2rem">
                <QRCodeSVG value={account?.value} />
              </Box>
              <FieldGroup w="100%" zIndex={1}>
                <TextField
                  label="Public Address"
                  value={account?.value}
                  InputProps={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    isReadOnly: true,
                  }}
                  width="100%"
                />
                <Button
                  px="1.5rem"
                  textColor={NAMED_COLORS.LIGHT_BLUE}
                  rightIcon={<IconCopy w="1rem" h="1rem" />}
                  onClick={() => navigator.clipboard.writeText(account?.value)}
                >
                  Copy
                </Button>
              </FieldGroup>
            </Flex>
          </Box>
        </Box>
        <Box ml="4rem">
          <DetailsPanel>
            <Information />
          </DetailsPanel>
        </Box>
      </Flex>
    </>
  )
}

export default ReceiveMoney
