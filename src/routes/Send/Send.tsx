import { FC, memo, useState, useEffect } from 'react'
import {
  Box,
  Flex,
  chakra,
  NAMED_COLORS,
  InputGroup,
  InputRightAddon,
  useColorModeValue,
  TextField,
  Button,
  Icon,
  SelectField,
  NumberInput,
  NumberInputField,
} from '@ironfish/ui-kit'
import { useLocation } from 'react-router-dom'
import AccountsSelect from 'Components/AccountsSelect'
import DetailsPanel from 'Components/DetailsPanel'
import useEstimatedFee from 'Hooks/transactions/useEstimatedFee'
import FeesImage from 'Svgx/FeesImage'
import SendIcon from 'Svgx/send'
import SendFlow from './SendFlow'
import Contact from 'Types/Contact'
import LocationStateProps from 'Types/LocationState'
import ContactsAutocomplete from 'Components/ContactsAutocomplete'
import CutAccount from 'Types/CutAccount'
import { useDataSync } from 'Providers/DataSyncProvider'
import { ORE_TO_IRON } from 'Utils/number'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import { decodeIron, formatOreToTronWithLanguage } from 'Utils/number'
import SyncWarningMessage from 'Components/SyncWarningMessage'
import capitalize from 'lodash/capitalize'

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

const hasEnoughIron = (balance: bigint, amount: bigint, fee = BigInt(0)) => {
  if (balance === BigInt(0)) {
    return false
  }
  return balance && amount && fee ? balance >= amount + fee : true
}

const getPrecision = (val: string) => {
  let precision = 2
  const dotIndex = val.indexOf('.')
  if (dotIndex === -1) {
    return precision
  }
  const part = val.slice(dotIndex + 1)
  precision = part.length
  for (let i = part.length - 1; i >= 2; i--) {
    if (part[i] === '0') {
      precision--
    } else {
      break
    }
  }
  return precision
}

const getEstimatedFeeOption = (priority: string, value: bigint) => ({
  value: value,
  label: `${formatOreToTronWithLanguage(value)}`,
  helperText: capitalize(priority),
})

interface SendButtonProps {
  setStart: (start: boolean) => void
  checkChanges: () => boolean
}

const SendButton: FC<SendButtonProps> = ({ setStart, checkChanges }) => {
  const { synced } = useDataSync()
  return (
    <Box>
      <SyncWarningMessage
        message="You cannot send a transaction while your wallet is syncing"
        mb="2rem"
      />
      <Button
        variant="primary"
        borderRadius="4rem"
        mb="2rem"
        p="2rem"
        isDisabled={!synced || checkChanges()}
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
  )
}

const Send: FC = () => {
  const location = useLocation()
  const state = location.state as LocationStateProps
  const [amount, setAmount] = useState('0.00')
  const [account, setAccount] = useState<CutAccount>(null)
  const [contact, setContact] = useState<Contact>(null)
  const [txnMemo, setTxnMemo] = useState('')
  const [startSendFlow, setStart] = useState(false)
  const [selectedFee, setSelectedFee] = useState<OptionType>()
  const { data: fees, loaded: feeCalculated } = useEstimatedFee(account?.id, {
    publicAddress: contact?.address || '',
    amount: decodeIron(amount || 0),
    memo: txnMemo,
  })
  const $colors = useColorModeValue(
    {
      bg: NAMED_COLORS.DEEP_BLUE,
      color: NAMED_COLORS.WHITE,
      warningBg: '#FFEDE8',
    },
    {
      bg: NAMED_COLORS.WHITE,
      color: NAMED_COLORS.DEEP_BLUE,
      warningBg: '#3E251B',
    }
  )

  const feeOptions = Object.entries(fees || {}).map(([key, value]) =>
    getEstimatedFeeOption(key, value)
  )

  useEffect(() => {
    if (Number(amount) !== 0 && !selectedFee?.label) {
      fees?.average &&
        setSelectedFee(getEstimatedFeeOption('average', fees?.average))
    }
  }, [amount])

  useEffect(() => {
    if (selectedFee) {
      const selectedOption = feeOptions.find(
        ({ helperText }) => selectedFee.helperText === helperText
      )
      if (selectedOption) {
        setSelectedFee(selectedOption)
      }
    }
  }, [feeCalculated])

  const checkChanges = (): boolean =>
    !(selectedFee?.value && account && contact && Number(amount)) ||
    !hasEnoughIron(
      account?.balances?.default?.confirmed,
      decodeIron(amount || 0),
      selectedFee.value
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
              <NumberInput
                value={amount}
                onChange={valueString => {
                  try {
                    decodeIron(valueString)
                    setAmount(valueString)
                  } catch (error) {
                    return
                  }
                }}
                precision={getPrecision(amount)}
                display="flex"
              >
                <NumberInputField
                  fontSize="3rem"
                  width={amount.length * 1.8 + 'rem'}
                  minW="3rem"
                  h="100%"
                  p="0rem"
                  textAlign="end"
                  border="none"
                  _focusVisible={{
                    border: 'none',
                  }}
                />
              </NumberInput>
              <InputRightAddon
                bg="transparent"
                border="none"
                color={NAMED_COLORS.GREY}
                fontSize="3rem"
                px="1rem"
              >
                $IRON
              </InputRightAddon>
            </InputGroup>
            <chakra.h5 color={NAMED_COLORS.GREY}>USD $ --</chakra.h5>
          </Flex>
          <Box mr="-0.25rem">
            {!hasEnoughIron(
              account?.balances?.default?.confirmed,
              decodeIron(amount || 0),
              selectedFee?.value
            ) && (
              <Flex
                w="100%"
                borderRadius="0.3125rem"
                bg={$colors.warningBg}
                h="4.3125rem"
                mt="-1rem"
                mb="1rem"
                alignItems="center"
                justifyContent="center"
              >
                <chakra.h4 color={NAMED_COLORS.RED}>
                  This account does not have enough funds for this transaction
                </chakra.h4>
              </Flex>
            )}
            <AccountsSelect
              label="From Account"
              mb="2rem"
              accountId={account?.id || state?.accountId}
              onSelectOption={setAccount}
            />
            <ContactsAutocomplete
              label={'To'}
              contactId={contact?._id}
              address={contact?.address || state?.address}
              onSelectOption={setContact}
              freeInput
              containerProps={{ mb: '2rem' }}
            />
            <Flex mb="2rem">
              <SelectField
                width="calc(50% - 1rem)"
                mr="2rem"
                label="Estimated Fee $IRON"
                value={selectedFee}
                options={feeOptions}
                onSelectOption={selected => setSelectedFee(selected)}
              />
              <TextField
                w="calc(50% - 1rem)"
                label={`Memo (${32 - txnMemo.length} characters)`}
                value={txnMemo}
                InputProps={{
                  onChange: e => setTxnMemo(e.target.value.substring(0, 32)),
                  maxLength: 32,
                }}
              />
            </Flex>
          </Box>
          <SendButton checkChanges={checkChanges} setStart={setStart} />
        </Box>
        <Box>
          <DetailsPanel>
            <Information />
          </DetailsPanel>
        </Box>
      </Flex>
      <SendFlow
        isOpen={startSendFlow}
        cleanUp={() => {
          setContact(null)
          setTxnMemo('')
          setSelectedFee(null)
          setAmount('0.00')
        }}
        onClose={() => setStart(false)}
        amount={decodeIron(amount || 0)}
        from={account}
        to={contact}
        memo={txnMemo}
        onCreateAccount={setContact}
        fee={selectedFee?.value}
      />
    </Flex>
  )
}

export default Send
