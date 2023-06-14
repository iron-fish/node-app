import {
  Box,
  Button,
  Flex,
  NAMED_COLORS,
  TextField,
  chakra,
  Link,
  useIronToast,
  useDisclosure,
  useColorMode,
} from '@ironfish/ui-kit'
// import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
// import useAccountSettings from 'Hooks/accounts/useAccountSettings'
import DetailsPanel from 'Components/DetailsPanel'
import { FC, memo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'Routes/data'
import Account from 'Types/Account'
import { formatOreToTronWithLanguage } from 'Utils/number'
import ConfirmModal from 'Components/ConfirmModal'
import AccountSettingsImageDark from 'Svgx/AccountSettingsImageDark'
import AccountSettingsImageLight from 'Svgx/AccountSettingsImageLight'

const Information: FC = memo(() => {
  const isLightMode = useColorMode().colorMode === 'light'
  return (
    <Box maxWidth="21.5rem">
      <chakra.h3 mb="1rem">Settings</chakra.h3>
      <chakra.h5
        mb="2rem"
        color={NAMED_COLORS.GREY}
        _dark={{ color: NAMED_COLORS.LIGHT_GREY }}
      >
        You can remove and reimport your accounts at your convenience, provided
        that you possess the necessary account keys. To ensure a seamless
        experience, it is highly recommended to maintain a backup of your
        account keys in a secure location.
      </chakra.h5>
      {isLightMode ? (
        <AccountSettingsImageLight />
      ) : (
        <AccountSettingsImageDark />
      )}
    </Box>
  )
})

interface AccountSettingsProps {
  account: Account
  updateAccount: (identity: string, name: string) => void
  deleteAccount: (identity: string) => Promise<void>
}

// const CURRENCIES = [
//   {
//     value: 'USD',
//     label: 'USD',
//     helperText: 'United States dollar',
//   },
//   {
//     value: 'EUR',
//     label: 'EUR',
//     helperText: 'Euro',
//   },
//   {
//     value: 'GBP',
//     label: 'GBP',
//     helperText: 'Pound Sterling',
//   },
// ]

interface RemoveAccountButtonProps {
  account: Account
  onDelete: () => void
}

const RemoveAccountButton: FC<RemoveAccountButtonProps> = ({
  account,
  onDelete,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const balance = account?.balances?.default?.confirmed || BigInt(0)
  const description = `This account currently holds ${formatOreToTronWithLanguage(
    balance
  )} $IRON. ${
    balance
      ? 'If you delete this account without exporting it first, YOU WILL LOSE THIS IRON.'
      : ''
  }`
  return (
    <>
      <Link alignSelf="center" onClick={onOpen}>
        <chakra.h4>Remove Account</chakra.h4>
      </Link>
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          onDelete()
          onClose()
        }}
        title="Remove Account"
        description={description}
        validationText={account?.name}
        buttonText="Remove Account"
      />
    </>
  )
}

const AccountSettings: FC<AccountSettingsProps> = ({
  account,
  deleteAccount,
}) => {
  const navigate = useNavigate()
  const [name, setName] = useState<string>('')
  // const [currency, setCurrency] = useState<OptionType>(CURRENCIES[0])
  // const [{ data: settings, loaded }, updateSettings] = useAccountSettings(
  //   account?.id
  // )
  const toast = useIronToast({
    containerStyle: {
      mb: '1rem',
    },
  })

  useEffect(() => {
    setName(account?.name)
  }, [account])

  // const checkChanges: () => boolean = () =>
  //   (loaded && name !== account?.name) || currency.value !== settings?.currency

  return (
    <Flex mb="4rem">
      <Box w="37.25rem">
        <TextField
          mb="2rem"
          label="Account Name"
          value={name}
          InputProps={{
            isDisabled: true,
            onChange: e => setName(e.target.value),
          }}
        />
        {/* <SelectField
          mb="2rem"
          label="Currency Converter"
          value={currency}
          onSelectOption={setCurrency}
          options={CURRENCIES}
        /> */}
        <Flex>
          <Button
            p="2rem"
            borderRadius="4.5rem"
            variant="primary"
            mr="2rem"
            isDisabled={true}
            onClick={() => {
              Promise.all([
                // updateAccount(account.id, name),
                // updateSettings(account.id, currency.value),
              ]).then(() => toast({ title: 'Account Details Updated' }))
            }}
          >
            Save Changes
          </Button>
          <RemoveAccountButton
            account={account}
            onDelete={() =>
              deleteAccount(account?.name).then(() => {
                navigate(ROUTES.ACCOUNTS, { state: { recheckAccounts: true } })
                toast({ title: 'Account Removed' })
              })
            }
          />
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
