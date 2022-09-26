import {
  Box,
  Button,
  Flex,
  NAMED_COLORS,
  SelectField,
  TextField,
  useColorModeValue,
  chakra,
  Link,
} from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import DetailsPanel from 'Components/DetailsPanel'
import { FC, memo, useState, useEffect } from 'react'
import AccountSettingsImage from 'Svgx/AccountSettingsImage'
import { Account } from 'Data/types/Account'
import useAccountSettings from 'Hooks/accounts/useAccountSettings'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'Routes/data'

const Information: FC = memo(() => {
  const textColor = useColorModeValue(
    NAMED_COLORS.GREY,
    NAMED_COLORS.LIGHT_GREY
  )
  return (
    <Box maxWidth="21.5rem">
      <chakra.h3 mb="1rem">Settings</chakra.h3>
      <chakra.h5 mb="2rem" color={textColor}>
        Changing your account name and preffered currency are a great way to
        personalize your wallet experience.
      </chakra.h5>
      <AccountSettingsImage />
    </Box>
  )
})

interface AccountSettingsProps {
  account: Account
  updateAccount: (identity: string, name: string) => void
  deleteAccount: (identity: string) => Promise<boolean>
}

const CURRENCIES = [
  {
    value: 'USD',
    label: 'USD',
    helperText: 'United States dollar',
  },
  {
    value: 'EUR',
    label: 'EUR',
    helperText: 'Euro',
  },
  {
    value: 'GBP',
    label: 'GBP',
    helperText: 'Pound Sterling',
  },
]

const AccountSettings: FC<AccountSettingsProps> = ({
  account,
  updateAccount,
  deleteAccount,
}) => {
  const [name, setName] = useState<string>('')
  const [currency, setCurrency] = useState<OptionType>(CURRENCIES[0])
  const navigate = useNavigate()
  const [{ data: settings, loaded }, updateSettings] = useAccountSettings(
    account?.identity
  )

  useEffect(() => {
    if (settings && loaded) {
      setName(account?.name)
      const currencyOption = CURRENCIES.find(
        ({ value }) => value === settings.currency
      )
      if (currencyOption) {
        setCurrency(currencyOption)
      }
    }
  }, [settings, loaded])

  const checkChanges: () => boolean = () =>
    (loaded && name !== account?.name) || currency.value !== settings?.currency

  return (
    <Flex mb="4rem">
      <Box w="37.25rem">
        <TextField
          mb="2rem"
          label="Account Name"
          value={name}
          InputProps={{
            onChange: e => setName(e.target.value),
          }}
        />
        <SelectField
          mb="2rem"
          label="Currency Converter"
          value={currency}
          onSelectOption={setCurrency}
          options={CURRENCIES}
        />
        <Flex>
          <Button
            p="2rem"
            borderRadius="4.5rem"
            variant="primary"
            mr="2rem"
            isDisabled={!checkChanges()}
            onClick={() => {
              Promise.all([
                updateAccount(account.identity, name),
                updateSettings(settings.accountId, currency.value),
              ])
            }}
          >
            Save Changes
          </Button>
          <Link
            alignSelf="center"
            onClick={() =>
              deleteAccount(account.identity).then(
                deleted => deleted && navigate(ROUTES.ACCOUNTS)
              )
            }
          >
            <h4>Delete Account</h4>
          </Link>
        </Flex>
      </Box>
      <Box>
        <DetailsPanel>
          <Information />
        </DetailsPanel>
      </Box>
    </Flex>
  )
}

export default AccountSettings
