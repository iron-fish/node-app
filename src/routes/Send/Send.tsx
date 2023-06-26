import { FC, memo, useState, useEffect, useMemo, useRef } from 'react'
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
  useDimensions,
  useColorMode,
} from '@ironfish/ui-kit'
import { useLocation } from 'react-router-dom'
import AccountsSelect from 'Components/AccountsSelect'
import DetailsPanel from 'Components/DetailsPanel'
import useEstimatedFee from 'Hooks/transactions/useEstimatedFee'
import FeesImageDark from 'Svgx/FeesImageDark'
import FeesImageLight from 'Svgx/FeesImageLight'
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
import WarningMessage from 'Components/WarningMessage'

const Information: FC = memo(() => {
  const { colorMode } = useColorMode()
  const isLightMode = colorMode === 'light'
  return (
    <Box maxWidth="21.5rem">
      <chakra.h3 mb="1rem">About Fees</chakra.h3>
      <chakra.h5
        color={NAMED_COLORS.GREY}
        _dark={{ color: NAMED_COLORS.LIGHT_GREY }}
      >
        You can change the fee amount you'd like to pay. However, that will
        directly correlate with the speed with which your transaction is picked
        up by the blockchain.
      </chakra.h5>
      {isLightMode ? <FeesImageLight mt="2rem" /> : <FeesImageDark mt="2rem" />}
    </Box>
  )
})

const getPrecision = (val: string | null) => {
  if (!val) return 2

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
  const [amount, setAmount] = useState<string | null>(null)
  const [account, setAccount] = useState<CutAccount>(null)
  const [contact, setContact] = useState<Contact>(null)
  const [balance, setBalance] = useState<AccountBalance>(null)
  const [txnMemo, setTxnMemo] = useState('')
  const [startSendFlow, setStart] = useState(false)
  const [selectedFee, setSelectedFee] = useState<OptionType | null>()
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
    if (amount && Number(amount) !== 0 && !selectedFee) {
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
            <AmountInput
              value={amount}
              onChange={valueString => {
                if (!valueString) {
                  setAmount(null)
                  return
                }

                if (valueString === '.') {
                  setAmount('0.')
                  return
                }

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
              asset={balance?.asset.name || '$IRON'}
            />
            <chakra.h5>{`Account Balance: ${
              balance?.confirmed
                ? formatOreToTronWithLanguage(balance.confirmed)
                : 0
            }`}</chakra.h5>
          </Flex>
          <Box mr="-0.25rem">
            <WarningMessage
              message={error}
              isVisible={!!error}
              style="danger"
              mt="-1rem"
              mb="1rem"
            />
            <Box
              sx={{
                '.select-field__value-text.select-field__value-text': {
                  color: 'inherit',
                },
                '.option-text.option-text': {
                  color: 'inherit',
                },
              }}
            >
              <AccountsSelect
                label="From Account"
                mb="2rem"
                accountId={account?.id || state?.accountId}
                onSelectOption={setAccount}
                showBalance={false}
                watchBalance={true}
              />
            </Box>
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
                setAmount(null)
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
                emptyOption="Select fee for transaction"
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
          setAmount(null)
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

function AmountInput({
  onChange,
  value,
  precision,
  asset,
}: {
  onChange: (value: string) => void
  value: string | null
  precision: number
  asset: string
}) {
  const wrapperRef = useRef(null)
  const wrapperWidth = useDimensions(wrapperRef, true)?.borderBox.width
  const assetLabelRef = useRef(null)
  const assetLabelWidth = useDimensions(assetLabelRef, true)?.borderBox.width
  const inputMaxWidth = wrapperWidth - assetLabelWidth
  return (
    <Box w="100%" ref={wrapperRef} overflow="hidden">
      <InputGroup
        width="auto"
        fontSize="3rem"
        alignItems="baseline"
        my="1rem"
        justifyContent="center"
        maxW="100%"
      >
        <NumberInput
          value={value ?? ''}
          step={0.00000001}
          onChange={onChange}
          precision={precision}
          display="flex"
        >
          <NumberInputField
            placeholder="0"
            fontSize="3rem"
            width={(value ? value.length : 1) * 1.9 + 'rem'}
            minW="3rem"
            h="100%"
            p="0rem"
            textAlign="end"
            border="none"
            _placeholder={{
              color: NAMED_COLORS.GREY,
            }}
            maxW={inputMaxWidth ? `${inputMaxWidth}px` : 'auto'}
            _focusVisible={{
              border: 'none',
            }}
          />
        </NumberInput>
        <InputRightAddon
          ref={assetLabelRef}
          border="none"
          color={NAMED_COLORS.GREY}
          fontSize="3rem"
          px="1rem"
        >
          {asset}
        </InputRightAddon>
      </InputGroup>
    </Box>
  )
}

export default Send
