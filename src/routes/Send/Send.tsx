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
  Autocomplete,
} from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import DetailsPanel from 'Components/DetailsPanel'
import { FC, memo, useState } from 'react'
import FeesImage from 'Svgx/FeesImage'
import SendIcon from 'Svgx/send'
import SendFlow from './SendFlow'

const DEMO_ACCOUNTS: OptionType[] = [
  {
    label: 'Primary Account',
    helperText: '8.456 $IRON',
    value: '000000000006084ed8a065122fced71976932343104c1f3e76b36b42e03680e9',
  },
  {
    label: 'Secondary Account',
    helperText: '1.944 $IRON',
    value: '00000000000515bce83c4755401d2fab9562a0ed4e8b6b38f361a23075614c97',
  },
  {
    label: 'Account 3',
    helperText: '56 $IRON',
    value: '0000000000034b8458a3f330cc95be812cd5a9d5b58fa002232bd5585fbf77ad',
  },
  {
    label: 'Account 4',
    helperText: '56 $IRON',
    value: '000000000007db9f646473593dced506c7ffce5455557fe7b93c7a43ca39ffd7',
  },
  {
    label: 'Account 5',
    helperText: '56 $IRON',
    value: '0000000000029ae7122d85141a1f1a44164ada8910496d1f1a5d3b9024d9ec0b',
  },
]

const DEMO_CONTACTS: OptionType[] = [
  {
    label: 'Frankie Boy',
    helperText: '0000...80e9',
    value: '000000000006084ed8a065122fced71976932343104c1f3e76b36b42e03680e9',
  },
  {
    label: 'Tweetie',
    helperText: '0000...4c97',
    value: '00000000000515bce83c4755401d2fab9562a0ed4e8b6b38f361a23075614c97',
  },
  {
    label: 'Rox1923',
    helperText: '0000...77ad',
    value: '0000000000034b8458a3f330cc95be812cd5a9d5b58fa002232bd5585fbf77ad',
  },
  {
    label: 'Alfred A',
    helperText: '0000...ffd7',
    value: '000000000007db9f646473593dced506c7ffce5455557fe7b93c7a43ca39ffd7',
  },
  {
    label: 'Derek',
    helperText: '0000...ec0b',
    value: '0000000000029ae7122d85141a1f1a44164ada8910496d1f1a5d3b9024d9ec0b',
  },
]

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

const filterOption = (option: OptionType, searchTerm: string) => {
  const _label = option.label?.toString().toLowerCase()
  const _value = option.value?.toString().toLowerCase()
  const _searchTerm = searchTerm.toLowerCase()

  return _label?.includes(_searchTerm) || _value?.includes(_searchTerm)
}

const Send: FC = () => {
  const [amount, setAmount] = useState(0)
  const [account, setAccount] = useState(DEMO_ACCOUNTS[0])
  const [contact, setContact] = useState(null)
  const [notes, setNotes] = useState('Paying you back, Derek - B.')
  const [startSendFlow, setStart] = useState(false)
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
            <SelectField
              label="From Account"
              mb="2rem"
              options={DEMO_ACCOUNTS}
              value={account}
              onSelectOption={setAccount}
            />
            <Autocomplete
              label="To"
              mb="2rem"
              options={DEMO_CONTACTS}
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
        from={account.label.toString()}
        to={contact?.label.toString()}
        memo={notes}
      />
    </Flex>
  )
}

export default Send
