import {
  Box,
  Button,
  chakra,
  Flex,
  NAMED_COLORS,
  Spinner,
  useColorModeValue,
} from '@ironfish/ui-kit'
import DetailsPanel from 'Components/DetailsPanel'
import { FC, memo, useState } from 'react'
import AccountKeysImage from 'Svgx/AccountKeysImage'
import LinkLaunchIcon from 'Svgx/LinkLaunch'
import DownloadIcon from '@ironfish/ui-kit/dist/svgx/download-icon'
import { AccountValue } from '@ironfish/sdk'
import PasswordField from 'Components/PasswordField'
import Account from 'Types/Account'

interface AccountKeysProps {
  account: Account
  exportAccount: (id: string) => Promise<Omit<AccountValue, 'id'>>
}

const Information: FC = memo(() => {
  const textColor = useColorModeValue(
    NAMED_COLORS.GREY,
    NAMED_COLORS.LIGHT_GREY
  )
  return (
    <Box maxWidth="21.5rem">
      <chakra.h3 mb="1rem">Keys</chakra.h3>
      <chakra.h5 mb="2rem" color={textColor}>
        Keep your keys safe by only revealing their contents when you’re sure
        nobody is peering. These are used to access your accounts and are the
        primary security measure against non-solicited user access.
        <br />
        <br />
        If you’re ever to import or recover your account, please do so by using
        your spending key. So please, be sure to keep that safe somewhere else,
        such as on a piece of paper.{' '}
        <Button
          variant="link"
          color={NAMED_COLORS.LIGHT_BLUE}
          rightIcon={<LinkLaunchIcon h="0.875rem" w="0.875rem" />}
        >
          <chakra.h5>Learn more here</chakra.h5>
        </Button>
      </chakra.h5>
      <AccountKeysImage />
    </Box>
  )
})

const AccountKeys: FC<AccountKeysProps> = ({ account, exportAccount }) => {
  const [exporting, setExporting] = useState<boolean>(false)

  const handleExport = () => {
    setExporting(true)
    exportAccount(account.id)
      .then(exportedAccount => {
        const data = JSON.stringify(exportedAccount)
        const file = new Blob([data], { type: 'text/plain' })
        const element = document.createElement('a')
        element.href = URL.createObjectURL(file)
        element.download = account.name + '.json'
        document.body.appendChild(element)
        element.click()
        document.removeChild(element)
      })
      .catch(e => {
        //TODO: add toast on error
      })
      .finally(() => setExporting(false))
  }

  return (
    <Flex mb="4rem">
      <Box w="37.25rem">
        <PasswordField
          label="Spending Key"
          placeholder="Enter key"
          value={account?.spendingKey}
          mb="2rem"
          InputProps={{
            isReadOnly: true,
          }}
        />
        <PasswordField
          label="Incoming View Key"
          placeholder="Enter key"
          value={account?.incomingViewKey}
          mb="2rem"
          InputProps={{
            isReadOnly: true,
          }}
        />
        <PasswordField
          label="Outgoing View Key"
          placeholder="Enter key"
          value={account?.outgoingViewKey}
          mb="2rem"
          InputProps={{
            isReadOnly: true,
          }}
        />
        <Flex>
          <Button
            variant="primary"
            size="medium"
            mr="2rem"
            isDisabled={exporting}
            onClick={handleExport}
            leftIcon={exporting ? <Spinner /> : <DownloadIcon />}
          >
            Export Account
          </Button>
        </Flex>
      </Box>
      <Box>
        <DetailsPanel>
          <Information />
        </DetailsPanel>
      </Box>
    </Flex>
  )
}

export default AccountKeys
