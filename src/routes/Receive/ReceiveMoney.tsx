import { FC, memo, useState } from 'react'
import {
  Box,
  Flex,
  chakra,
  useColorModeValue,
  NAMED_COLORS,
  Button,
  SelectField,
  TextField,
  FieldGroup,
} from '@ironfish/ui-kit'
import { QRCodeSVG } from 'qrcode.react'
import DetailsPanel from 'Components/DetailsPanel'
import AccountSettingsImage from 'Svgx/AccountSettingsImage'
import LinkLaunchIcon from 'Svgx/LinkLaunch'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import IconCopy from '@ironfish/ui-kit/dist/svgx/icon-copy'

const Information: FC = memo(() => {
  const textColor = useColorModeValue(
    NAMED_COLORS.GREY,
    NAMED_COLORS.LIGHT_GREY
  )
  return (
    <Box maxWidth="21.5rem">
      <chakra.h3 mb="1rem">Use our block explorer</chakra.h3>
      <chakra.h5 mb="2rem" color={textColor}>
        Want to ensure your receipient, or yourself, that a transaction has been
        sent? Request a transaction link from the iron fish block explorer!
        <br />
        <br />
        <Button
          variant="link"
          color={NAMED_COLORS.LIGHT_BLUE}
          rightIcon={<LinkLaunchIcon h="0.875rem" w="0.875rem" />}
          onClick={() => window.open('https://explorer.ironfish.network/')}
        >
          <chakra.h5>Check it out!</chakra.h5>
        </Button>
      </chakra.h5>
      <AccountSettingsImage />
    </Box>
  )
})

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

const ReceiveMoney: FC = () => {
  const [account, setAccount] = useState(DEMO_ACCOUNTS[0])
  const [amount, setAmount] = useState(0)

  const url = `ironfish-wallet://localhost:3000/wallet#/send?to=${account.value}&amount=${amount}`
  return (
    <>
      <chakra.h2 mb="1rem">Receive $IRON</chakra.h2>
      <Flex mb="4rem">
        <Box w="37.25rem">
          <SelectField
            label="Account"
            value={account}
            options={DEMO_ACCOUNTS}
            onSelectOption={setAccount}
            mb="1rem"
          />
          {/* Hide amount field while not clarified, should be removed or enabled when with API connection
           <TextField
            label="Amount"
            value={amount.toFixed(2)}
            InputProps={{
              type: 'number',
              onChange: e => setAmount(Number.parseFloat(e.target.value)),
            }}
            mb="1rem"
          /> */}
          <Box mr="0.25rem">
            <Flex
              layerStyle="card"
              w="100%"
              p="4rem"
              direction="column"
              alignItems="center"
              ml={0}
            >
              <Box mb="2rem">
                <QRCodeSVG value={url} />
              </Box>
              <FieldGroup w="100%">
                <TextField
                  label="Receive Link"
                  value={url}
                  InputProps={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    isReadOnly: true,
                  }}
                  width="100%"
                />
                <Button
                  px="1.5rem"
                  textColor={NAMED_COLORS.LIGHT_BLUE}
                  rightIcon={<IconCopy w="1rem" h="1rem" />}
                >
                  Copy
                </Button>
              </FieldGroup>
            </Flex>
          </Box>
        </Box>
        <Box ml="4rem">
          <DetailsPanel>
            <Information />
          </DetailsPanel>
        </Box>
      </Flex>
    </>
  )
}

export default ReceiveMoney
