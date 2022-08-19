import {
  Box,
  Button,
  Flex,
  NAMED_COLORS,
  SelectField,
  TextField,
  useColorModeValue,
  chakra,
} from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import DetailsPanel from 'Components/DetailsPanel'
import { FC, memo, useState } from 'react'
import AccountSettingsImage from 'Svgx/AccountSettingsImage'

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
  id: string
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

const AccountSettings: FC<AccountSettingsProps> = props => {
  const [name, setName] = useState<string>('Primary Account')
  const [currency, setCurrency] = useState<OptionType>(CURRENCIES[0])
  const checkChanges: () => boolean = () =>
    name !== 'Primary Account' || currency.value !== 'USD'
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
            disabled={!checkChanges()}
          >
            Save Changes
          </Button>
          <Button variant="link">Delete Account</Button>
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
