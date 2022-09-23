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
  TextField,
  Button,
  Icon,
  Autocomplete,
} from '@ironfish/ui-kit'
import { useLocation } from 'react-router-dom'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import AccountsSelect from 'Components/AccountsSelect'
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

const Information: FC = memo(() => {
  const textColor = useColorModeValue(
    NAMED_COLORS.GREY,
    NAMED_COLORS.LIGHT_GREY
  )
  return (
    <Box maxWidth="21.5rem">
      <chakra.h3 mb="1rem">About Fees</chakra.h3>
      <chakra.h5 color={textColor}>
        You can change the fee amount you’d like to pay however that will
        directly correlate the speed with which youe transaction is picked up by
        the block chain.
      </chakra.h5>
      <FeesImage mt="2rem" />
    </Box>
  )
})

const getContactOptions = (contacts: Contact[] = []) =>
  contacts.map((contact: Contact) => ({
    label: contact.name,
    helperText: truncateHash(contact.address, 2, 4),
    value: contact.address,
  }))

const filterOption = (option: OptionType, searchTerm: string) => {
  const _label = option.label?.toString().toLowerCase()
  const _value = option.value?.toString().toLowerCase()
  const _searchTerm = searchTerm.toLowerCase()

  return _label?.includes(_searchTerm) || _value?.includes(_searchTerm)
}

const Send: FC = () => {
  const location = useLocation()
  const state = location.state as LocationStateProps //state.accountId
  const [amount, setAmount] = useState(0)
  const [account, setAccount] = useState(null)
  const [contact, setContact] = useState(null)
  const [notes, setNotes] = useState('Paying you back, Derek - B.')
  const [startSendFlow, setStart] = useState(false)
  const { data: accounts, loaded: accountsLoaded } = useAccounts()
  const [{ data: contacts, loaded: contactsLoaded }] = useAddressBook()
  const { data: fee, loaded: feeCalculated } = useFee(amount)

  const contactOptions = useMemo(
    () => getContactOptions(contacts),
    [JSON.stringify(contacts)]
  )

  const $colors = useColorModeValue(
    { bg: NAMED_COLORS.DEEP_BLUE, color: NAMED_COLORS.WHITE },
    { bg: NAMED_COLORS.WHITE, color: NAMED_COLORS.DEEP_BLUE }
  )
  return (
    <Flex flexDirection="column" pb="0" bg="transparent" w="100%">
      <Box>
        <chakra.h2 mb="1rem">Send $IRON</chakra.h2>
      </Box>
      <Flex>
        <Box w="37.25rem">
          <Flex
            layerStyle="card"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            w="inherit"
            h="16rem"
            bg={`${$colors.bg} !important`}
            color={$colors.color}
            mb="2rem"
            borderRadius="0.25rem"
            ml="0"
          >
            <chakra.h4>I want to send</chakra.h4>
            <InputGroup
              width="auto"
              fontSize="3rem"
              alignItems="baseline"
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
              >
                $IRON
              </InputRightAddon>
            </InputGroup>
            <chakra.h5 color={NAMED_COLORS.GREY}>USD $ --</chakra.h5>
          </Flex>
          <Box mr="-0.25rem">
            <AccountsSelect
              label="From Account"
              mb="2rem"
              address={account?.value}
              onSelectOption={setAccount}
            />
            <Autocomplete
              label="To"
              mb="2rem"
              options={contactOptions}
              value={contact}
              onSelectOption={setContact}
              filterOption={filterOption}
              InputProps={{
                placeholder: 'Input Text',
              }}
            />
            <Flex mb="2rem">
              <TextField
                w="calc(50% - 1rem)"
                mr="2rem"
                label="Fee"
                value={(amount * 0.01).toFixed(2)}
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
          </Box>
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
