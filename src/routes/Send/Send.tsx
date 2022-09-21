import { FC, memo, useState, useEffect, useMemo } from 'react'
import {
  Box,
  Flex,
  chakra,
  NAMED_COLORS,
  Input,
  InputGroup,
  InputRightAddon,
  useColorModeValue,
  SelectField,
  TextField,
  Button,
  Icon,
} from '@ironfish/ui-kit'
import { useLocation } from 'react-router-dom'
import DetailsPanel from 'Components/DetailsPanel'
import useAccounts from 'Hooks/accounts/useAccounts'
import useAddressBook from 'Hooks/addressBook/useAddressBook'
import useFee from 'Hooks/transactions/useFee'
import FeesImage from 'Svgx/FeesImage'
import SendIcon from 'Svgx/send'
import SendFlow from './SendFlow'
import { Account } from 'Data/types/Account'
import { Contact } from 'Data/types/Contact'
import { truncateHash } from 'Utils/hash'
import LocationStateProps from 'Types/LocationState'

const getAccountOptions = (accounts: Account[] = []) =>
  accounts.map((account: Account) => ({
    label: account.name,
    helperText: `${account.balance} $IRON`,
    value: account.address,
  }))

const getContactOptions = (contacts: Contact[] = []) =>
  contacts.map((contact: Contact) => ({
    label: contact.name,
    helperText: truncateHash(contact.address, 2, 4),
    value: contact.address,
  }))

const Information: FC = memo(() => {
  const textColor = useColorModeValue(
    NAMED_COLORS.GREY,
    NAMED_COLORS.LIGHT_GREY
  )
  return (
    <>
      <chakra.h3 mb="1rem">About Fees</chakra.h3>
      <chakra.h5 color={textColor}>
        You can change the fee amount you’d like to pay however that will
        directly correlate the speed with which youe transaction is picked up by
        the block chain.
      </chakra.h5>
      <FeesImage mt="2rem" />
    </>
  )
})

const Send: FC = () => {
  const location = useLocation()
  const state = location.state as LocationStateProps
  const [amount, setAmount] = useState(0)
  const [account, setAccount] = useState(null)
  const [contact, setContact] = useState(null)
  const [notes, setNotes] = useState('Paying you back, Derek - B.')
  const [startSendFlow, setStart] = useState(false)
  const { data: accounts, loaded: accountsLoaded } = useAccounts()
  const [{ data: contacts, loaded: contactsLoaded }] = useAddressBook()
  const { data: fee, loaded: feeCalculated } = useFee(amount)

  const accountOptions = useMemo(
    () => getAccountOptions(accounts),
    [JSON.stringify(accounts)]
  )

  const contactOptions = useMemo(
    () => getContactOptions(contacts),
    [JSON.stringify(contacts)]
  )

  useEffect(() => {
    if (accountsLoaded) {
      const selectedAccount =
        state && accountOptions.find(({ value }) => value === state.accountId)
      setAccount(selectedAccount ? selectedAccount : accountOptions[0])
    }
  }, [accountsLoaded])

  return (
    <Flex flexDirection="column" pb="0" bg="transparent" w="100%">
      <Box>
        <chakra.h2 mb="1rem">Send $IRON</chakra.h2>
      </Box>
      <Flex>
        <Box w="37.25rem">
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            w="inherit"
            h="16rem"
            bg={NAMED_COLORS.DEEP_BLUE}
            color={NAMED_COLORS.WHITE}
            mb="2rem"
          >
            <chakra.h4>I want to send</chakra.h4>
            <InputGroup
              width="auto"
              fontSize="3rem"
              alignItems="center"
              my="1rem"
            >
              <Input
                variant="unstyled"
                type="number"
                fontSize="3rem"
                width={amount.toFixed(2).toString().length * 1.8 + 'rem'}
                value={amount.toFixed(2)}
                onChange={e => setAmount(Number.parseFloat(e.target.value))}
                textAlign="end"
                step={0.01}
                min={0}
              />
              <InputRightAddon
                bg="transparent"
                border="none"
                color={NAMED_COLORS.GREY}
                fontSize="3rem"
                mb="0.8rem"
              >
                $IRON
              </InputRightAddon>
            </InputGroup>
            <chakra.h5 color={NAMED_COLORS.GREY}>USD $ --</chakra.h5>
          </Flex>
          <SelectField
            label="From Account"
            mb="2rem"
            options={accountOptions}
            value={account}
            onSelectOption={setAccount}
          />
          <SelectField
            label="To"
            mb="2rem"
            options={contactOptions}
            value={contact}
            onSelectOption={setContact}
          />
          <Flex mb="2rem">
            <TextField
              w="calc(50% - 1rem)"
              mr="2rem"
              label="Fee"
              value={(fee || 0).toFixed(2)}
              InputProps={{
                isReadOnly: true,
              }}
            />
            <TextField
              w="calc(50% - 1rem)"
              label="Memo (32 characters)"
              value={notes}
              InputProps={{
                onChange: e => setNotes(e.target.value.substring(0, 32)),
              }}
            />
          </Flex>
          <Button
            variant="primary"
            borderRadius="4rem"
            mb="2rem"
            p="2rem"
            isDisabled={!(feeCalculated && account && contact && amount)}
            leftIcon={
              <Icon height={26} width={26}>
                <SendIcon fill="currentColor" />
              </Icon>
            }
            onClick={() => setStart(true)}
          >
            <chakra.h4>Send $IRON</chakra.h4>
          </Button>
        </Box>
        <Box>
          <DetailsPanel>
            <Information />
          </DetailsPanel>
        </Box>
      </Flex>
      <SendFlow
        isOpen={startSendFlow}
        onClose={() => setStart(false)}
        amount={amount}
        from={accounts?.find(({ address }) => account?.value == address)}
        to={contacts?.find(({ address }) => contact?.value === address)}
        memo={notes}
        fee={fee}
      />
    </Flex>
  )
}

export default Send
