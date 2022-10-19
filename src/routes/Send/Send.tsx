import { ChangeEvent, FC, memo, useState } from 'react'
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
  InputProps,
} from '@ironfish/ui-kit'
import { useLocation } from 'react-router-dom'
import AccountsSelect from 'Components/AccountsSelect'
import DetailsPanel from 'Components/DetailsPanel'
import useFee from 'Hooks/transactions/useFee'
import FeesImage from 'Svgx/FeesImage'
import SendIcon from 'Svgx/send'
import SendFlow from './SendFlow'
import { Account } from 'Data/types/Account'
import Contact from 'Types/Contact'
import LocationStateProps from 'Types/LocationState'
import ContactsAutocomplete from 'Components/ContactsAutocomplete'
import { useDataSync } from 'Providers/DataSyncProvider'

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

interface FloatInputProps {
  amount: number
  setAmount: (value: number) => void
  InputProps?: InputProps
}

const FloatInput: FC<FloatInputProps> = ({ amount, setAmount }) => {
  const [value, setValue] = useState(amount.toFixed(2).toString())

  const handleNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value

    if (input.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
      setValue(input)
    }
  }

  const handleFloat = () => {
    setAmount(parseFloat(value || '0'))
  }

  return (
    <Input
      variant="unstyled"
      fontSize="3rem"
      width={value.length * 1.8 + 'rem'}
      value={value}
      onChange={handleNumber}
      onBlur={handleFloat}
      textAlign="end"
    />
  )
}

const Send: FC = () => {
  const location = useLocation()
  const state = location.state as LocationStateProps
  const [amount, setAmount] = useState(0)
  const [account, setAccount] = useState<Account>(null)
  const [contact, setContact] = useState<Contact>(null)
  const [notes, setNotes] = useState('Paying you back, Derek - B.')
  const [startSendFlow, setStart] = useState(false)
  const { data: fee, loaded: feeCalculated } = useFee(amount)
  const $colors = useColorModeValue(
    { bg: NAMED_COLORS.DEEP_BLUE, color: NAMED_COLORS.WHITE },
    { bg: NAMED_COLORS.WHITE, color: NAMED_COLORS.DEEP_BLUE }
  )
  const { loaded } = useDataSync()

  const checkChanges: () => boolean = () =>
    !loaded || !(feeCalculated && account && contact && amount)

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
              <FloatInput amount={amount} setAmount={setAmount} />
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
              accountId={account?.identity || state?.accountId}
              onSelectOption={setAccount}
            />
            <ContactsAutocomplete
              label={'To'}
              contactId={contact?._id || state?.contactId}
              onSelectOption={setContact}
              mb="2rem"
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
                label={`Memo (${32 - notes.length} characters)`}
                value={notes}
                InputProps={{
                  onChange: e => setNotes(e.target.value.substring(0, 32)),
                  maxLength: 32,
                }}
              />
            </Flex>
          </Box>
          <Button
            variant="primary"
            borderRadius="4rem"
            mb="2rem"
            p="2rem"
            isDisabled={checkChanges()}
            disabled={checkChanges()}
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
        from={account}
        to={contact}
        memo={notes}
        fee={fee}
      />
    </Flex>
  )
}

export default Send
