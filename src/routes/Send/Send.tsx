import { FC, memo, useState, useEffect, useMemo } from 'react'
import {
  Box,
  Flex,
  chakra,
  NAMED_COLORS,
  InputGroup,
  InputRightAddon,
  TextField,
  Button,
  Icon,
  NumberInput,
  NumberInputField,
  Autocomplete,
} from '@ironfish/ui-kit'
import { useLocation } from 'react-router-dom'
import AccountsSelect from 'Components/AccountsSelect'
import DetailsPanel from 'Components/DetailsPanel'
import useEstimatedFee from 'Hooks/transactions/useEstimatedFee'
import FeesImage from 'Svgx/FeesImage'
import SendIcon from 'Svgx/send'
import SendFlow from './SendFlow/SendFlow'
import Contact from 'Types/Contact'
import LocationStateProps from 'Types/LocationState'
import ContactsAutocomplete from 'Components/ContactsAutocomplete'
import CutAccount from 'Types/CutAccount'
import { useDataSync } from 'Providers/DataSyncProvider'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import {
  IRON_PRECISION,
  decodeIron,
  formatOreToTronWithLanguage,
} from 'Utils/number'
import SyncWarningMessage from 'Components/SyncWarningMessage'
import capitalize from 'lodash/capitalize'
import AccountAssetsSelect from 'Components/AccountAssetsSelect'
import AccountBalance from 'Types/AccountBalance'

const Information: FC = memo(() => {
  return (
    <Box maxWidth="21.5rem">
      <chakra.h3 mb="1rem">About Fees</chakra.h3>
      <chakra.h5
        color={NAMED_COLORS.GREY}
        _dark={{ color: NAMED_COLORS.LIGHT_GREY }}
      >
        You can change the fee amount you’d like to pay however that will
        directly correlate the speed with which youe transaction is picked up by
        the block chain.
      </chakra.h5>
      <FeesImage mt="2rem" />
    </Box>
  )
})

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
  hasValidData: boolean
}

const SendButton: FC<SendButtonProps> = ({ setStart, hasValidData }) => {
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
        isDisabled={!synced || hasValidData}
        leftIcon={
          <Icon height={26} width={26}>
            <SendIcon fill="currentColor" />
          </Icon>
        }
        onClick={() => setStart(true)}
      >
        <chakra.h4>Send</chakra.h4>
      </Button>
    </Box>
  )
}

const NOT_ENOUGH_FUNDS =
  'This account does not have enough funds for this transaction'
const HAS_PENDING_TRANSACTIONS =
  'Please wait for any pending transactions to be confirmed'

const Send: FC = () => {
  const location = useLocation()
  const state = location.state as LocationStateProps
  const [amount, setAmount] = useState('0.00')
  const [account, setAccount] = useState<CutAccount>(null)
  const [contact, setContact] = useState<Contact>(null)
  const [balance, setBalance] = useState<AccountBalance>(null)
  const [txnMemo, setTxnMemo] = useState('')
  const [startSendFlow, setStart] = useState(false)
  const [selectedFee, setSelectedFee] = useState<OptionType>()
  const [error, setError] = useState('')
  const {
    data: fees,
    loaded: feeCalculated,
    error: feeError,
  } = useEstimatedFee(account?.id, {
    publicAddress: contact?.address || '',
    amount: decodeIron(amount || 0),
    memo: txnMemo,
    assetId: balance?.asset.id,
  })

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

  useEffect(() => {
    if (balance?.available === BigInt(0)) {
      return setError(HAS_PENDING_TRANSACTIONS)
    }
    if (balance?.confirmed === BigInt(0)) {
      return setError(NOT_ENOUGH_FUNDS)
    }
    const fee = selectedFee?.value || BigInt(0)
    const ironAmount = decodeIron(amount || 0)
    if (balance?.confirmed < ironAmount + fee) {
      return setError(NOT_ENOUGH_FUNDS)
    }
    setError('')
  }, [balance?.available, balance?.confirmed, amount, selectedFee?.value])

  const hasInvalidData = useMemo(() => {
    return !(
      selectedFee?.value &&
      account &&
      contact &&
      Number(amount) &&
      !error
    )
  }, [selectedFee?.value, account, contact, error, amount])

  return (
    <Flex flexDirection="column" pb="0" bg="transparent" w="100%">
      <Box>
        <chakra.h2 mb="1rem">Send</chakra.h2>
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
            bg={`${NAMED_COLORS.DEEP_BLUE} !important`}
            color={NAMED_COLORS.WHITE}
            _dark={{
              bg: `${NAMED_COLORS.WHITE} !important`,
              color: NAMED_COLORS.DEEP_BLUE,
            }}
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
              flexWrap="wrap"
              justifyContent="center"
            >
              <NumberInput
                value={amount}
                step={0.00000001}
                onChange={valueString => {
                  try {
                    const dotIndex = valueString.indexOf('.')
                    if (
                      dotIndex !== -1 &&
                      valueString.substring(dotIndex + 1, valueString.length)
                        .length > IRON_PRECISION
                    ) {
                      return
                    }
                    decodeIron(valueString)
                    setAmount(valueString)
                  } catch (err) {
                    return
                  }
                }}
                precision={getPrecision(amount)}
                display="flex"
              >
                <NumberInputField
                  fontSize="3rem"
                  width={amount.length * 1.9 + 'rem'}
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
                {balance?.asset.name || '$IRON'}
              </InputRightAddon>
            </InputGroup>
            {/* <chakra.h5 color={NAMED_COLORS.GREY}>USD $ --</chakra.h5> */}
          </Flex>
          <Box mr="-0.25rem">
            {error && (
              <Flex
                w="100%"
                borderRadius="0.3125rem"
                bg={'#FFEDE8'}
                _dark={{
                  bg: '#3E251B',
                }}
                h="4.3125rem"
                mt="-1rem"
                mb="1rem"
                alignItems="center"
                justifyContent="center"
              >
                <chakra.h4 color={NAMED_COLORS.RED}>{error}</chakra.h4>
              </Flex>
            )}
            <AccountsSelect
              label="From Account"
              mb="2rem"
              accountId={account?.id || state?.accountId}
              onSelectOption={setAccount}
              showBalance={false}
              watchBalance={true}
            />
            <AccountAssetsSelect
              mb="2rem"
              label="Asset"
              assets={
                account
                  ? [account.balances.default, ...account.balances.assets]
                  : []
              }
              selected={balance || account?.balances.default}
              onSelectOption={assetBalance => {
                setBalance(assetBalance)
                setAmount('0.00')
              }}
            />
            <ContactsAutocomplete
              label={'To'}
              contactId={contact?._id}
              address={contact?.address || state?.address}
              onSelectOption={setContact}
              freeInput
              containerProps={{ mb: '2rem' }}
            />
            <Flex mb="2rem" gap="2rem">
              <Autocomplete
                width="50%"
                label="Estimated Fee $IRON"
                value={selectedFee}
                options={feeOptions}
                onSelectOption={selected => setSelectedFee(selected)}
                emptyOption="Select receiver"
              />
              <TextField
                w="50%"
                label={`Memo (${32 - txnMemo.length} characters)`}
                value={txnMemo}
                InputProps={{
                  onChange: e => setTxnMemo(e.target.value.substring(0, 32)),
                  maxLength: 32,
                }}
              />
            </Flex>
          </Box>
          <SendButton hasValidData={hasInvalidData} setStart={setStart} />
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
        asset={balance?.asset}
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
