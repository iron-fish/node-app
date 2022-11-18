import { FC, memo, useState, useEffect } from 'react'
import {
  Box,
  Flex,
  chakra,
  useColorModeValue,
  NAMED_COLORS,
  Button,
  TextField,
  FieldGroup,
  Tooltip,
} from '@ironfish/ui-kit'
import { QRCodeSVG } from 'qrcode.react'
import { useLocation } from 'react-router-dom'
import DetailsPanel from 'Components/DetailsPanel'
import ReceiveIronImage from 'Svgx/ReceiveIronImage'
import LinkLaunchIcon from 'Svgx/LinkLaunch'
import IconCopy from '@ironfish/ui-kit/dist/svgx/icon-copy'
import LocationStateProps from 'Types/LocationState'
import AccountsSelect from 'Components/AccountsSelect'
import IconCheck from '@ironfish/ui-kit/dist/svgx/icon-check'
import CutAccount from 'Types/CutAccount'

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
      <ReceiveIronImage />
    </Box>
  )
})

interface ViewFieldProps {
  value: string
  buttonText: string
  copyTooltipText: string
  copiedTooltipText: string
  tooltipDelay?: number
}

const ViewField: FC<ViewFieldProps> = ({
  value,
  buttonText,
  copyTooltipText,
  copiedTooltipText,
  tooltipDelay = 1500,
}) => {
  const [$copied, $setCopied] = useState(false)

  useEffect(() => {
    if ($copied) {
      setTimeout(() => $setCopied(false), tooltipDelay)
    }
  }, [$copied])

  return (
    <FieldGroup w="100%" zIndex={1}>
      <TextField
        label="Public Address"
        value={value}
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
        onClick={() => {
          $setCopied(true)
          navigator.clipboard.writeText(value)
        }}
      >
        <Tooltip
          closeDelay={$copied ? tooltipDelay : 0}
          label={$copied ? copiedTooltipText : copyTooltipText}
        >
          <Flex align="center">
            <chakra.h4 mr="8px">{buttonText}</chakra.h4>
            {$copied ? <IconCheck color="green" /> : <IconCopy />}
          </Flex>
        </Tooltip>
      </Button>
    </FieldGroup>
  )
}

const ReceiveMoney: FC = () => {
  const location = useLocation()
  const state = location.state as LocationStateProps
  const [account, setAccount] = useState<CutAccount>(null)
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
            accountId={account?.id || state?.accountId}
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
                <QRCodeSVG value={account?.publicAddress} />
              </Box>
              <ViewField
                value={account?.publicAddress}
                buttonText="Copy"
                copiedTooltipText="Copied"
                copyTooltipText="Copy to clipboard"
              />
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
