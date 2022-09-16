import { FC, memo, useState } from 'react'
import {
  Box,
  Flex,
  chakra,
  useColorModeValue,
  NAMED_COLORS,
  Button,
  TextField,
  FieldGroup,
} from '@ironfish/ui-kit'
import { QRCodeSVG } from 'qrcode.react'
import DetailsPanel from 'Components/DetailsPanel'
import AccountSettingsImage from 'Svgx/AccountSettingsImage'
import LinkLaunchIcon from 'Svgx/LinkLaunch'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'
import IconCopy from '@ironfish/ui-kit/dist/svgx/icon-copy'
import AccountsSelect from 'Components/AccountsSelect'

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

const ReceiveMoney: FC = () => {
  const [account, setAccount] = useState(null)
  // const [amount, setAmount] = useState(0)

  return (
    <Flex flexDirection="column" pb="0" bg="transparent" w="100%">
      <Box>
        <chakra.h2 mb="1rem">Receive $IRON</chakra.h2>
      </Box>
      <Flex mb="4rem">
        <Box w="37.25rem">
          <AccountsSelect
            label="Account"
            address={account?.value}
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
                <QRCodeSVG value={account?.value} />
              </Box>
              <FieldGroup w="100%" zIndex={1}>
                <TextField
                  label="Public Address"
                  value={account?.value}
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
                  onClick={() => navigator.clipboard.writeText(account?.value)}
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
    </Flex>
  )
}

export default ReceiveMoney
