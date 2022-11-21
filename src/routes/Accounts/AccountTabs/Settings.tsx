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
  ModalProps,
} from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import DetailsPanel from 'Components/DetailsPanel'
import { FC, memo, useState, useEffect } from 'react'
import AccountSettingsImage from 'Svgx/AccountSettingsImage'
import useAccountSettings from 'Hooks/accounts/useAccountSettings'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'Routes/data'
import { AccountValue } from '@ironfish/sdk'
import ModalWindow from 'Components/ModalWindow'
import useAccountBalance from 'Hooks/accounts/useAccountBalance'

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
  account: AccountValue
  updateAccount: (identity: string, name: string) => void
  deleteAccount: (identity: string) => Promise<void>
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

interface RemoveAccountModalProps extends Omit<ModalProps, 'children'> {
  balance: number | bigint
  onDelete: () => void
}

const RemoveAccountModal: FC<RemoveAccountModalProps> = ({
  balance,
  onDelete,
  ...modalProps
}) => {
  return (
    <ModalWindow
      {...modalProps}
      onClose={() => {
        modalProps.onClose()
      }}
    >
      <chakra.h2 mb="16px">Remove Account</chakra.h2>
      {balance === 0 ? (
        <>
          <chakra.h4 mb="32px">
            You’re about to remove “Account Name”. Please be sure to have
            written down your mnemonic phrase if you plan to import it.
          </chakra.h4>
          <TextField
            label="Type REMOVE"
            value="REMOVE"
            mb="32px"
            InputProps={{
              isDisabled: true,
            }}
          />
          <Flex>
            <Button
              variant="primary"
              size="large"
              mr="24px"
              bgColor="#F15929"
              onClick={() => onDelete()}
            >
              Remove Account
            </Button>
            <Link
              alignSelf="center"
              onClick={() => {
                modalProps.onClose()
              }}
            >
              <h4>Cancel</h4>
            </Link>
          </Flex>
        </>
      ) : (
        <>
          <chakra.h4 mb="32px">
            {`This account currently holds ${balance} $IRON. Please send this $IRON to another account before removing.`}
          </chakra.h4>
          <Flex>
            <Link alignSelf="center" onClick={() => modalProps.onClose()}>
              <h4>Close</h4>
            </Link>
          </Flex>
        </>
      )}
    </ModalWindow>
  )
}

interface RemoveAccountButtonProps {
  accountId: string
  onDelete: () => void
}

const RemoveAccountButton: FC<RemoveAccountButtonProps> = ({
  accountId,
  onDelete,
}) => {
  const [openRemoveAccountModal, setOpenRemoveAccountModal] =
    useState<boolean>(false)
  const { data: balance } = useAccountBalance(accountId)

  return (
    <>
      <Link alignSelf="center" onClick={() => setOpenRemoveAccountModal(true)}>
        <chakra.h4>Delete Account</chakra.h4>
      </Link>
      <RemoveAccountModal
        balance={balance?.pending || 0}
        onDelete={() => {
          onDelete()
          setOpenRemoveAccountModal(false)
        }}
        isOpen={openRemoveAccountModal}
        onClose={() => setOpenRemoveAccountModal(false)}
      />
    </>
  )
}

const AccountSettings: FC<AccountSettingsProps> = ({
  account,
  updateAccount,
  deleteAccount,
}) => {
  const [name, setName] = useState<string>('')
  const [currency, setCurrency] = useState<OptionType>(CURRENCIES[0])
  const navigate = useNavigate()
  const [{ data: settings, loaded }, updateSettings] = useAccountSettings(
    account?.id
  )

  useEffect(() => {
    if (settings && loaded) {
      const currencyOption = CURRENCIES.find(
        ({ value }) => value === settings.currency
      )
      if (currencyOption) {
        setCurrency(currencyOption)
      }
    }
  }, [settings, loaded])

  useEffect(() => {
    setName(account?.name)
  }, [account])

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
            isDisabled: true,
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
                // updateAccount(account.id, name),
                updateSettings(account.id, currency.value),
              ])
            }}
          >
            Save Changes
          </Button>
          <RemoveAccountButton
            accountId={account?.id}
            onDelete={() =>
              deleteAccount(account?.name).then(() =>
                navigate(ROUTES.ACCOUNTS, { state: { recheckAccounts: true } })
              )
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
