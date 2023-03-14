import {
  Box,
  Button,
  chakra,
  Flex,
  NAMED_COLORS,
  Spinner,
  useColorModeValue,
  MnemonicView,
  CopyToClipboardButton,
} from '@ironfish/ui-kit'
import DetailsPanel from 'Components/DetailsPanel'
import { FC, memo, useState } from 'react'
import AccountKeysImage from 'Svgx/AccountKeysImage'
import LinkLaunchIcon from 'Svgx/LinkLaunch'
import DownloadIcon from '@ironfish/ui-kit/dist/svgx/download-icon'
import { AccountValue } from '@ironfish/sdk'
import Account from 'Types/Account'
import useMnemonicPhrase from 'Hooks/accounts/useMnemonicPhrase'

interface AccountKeysProps {
  account: Account
  exportAccount: (id: string) => Promise<Omit<AccountValue, 'rescan'>>
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
  const {
    data: phrase,
    loaded,
    showPhrase,
    actions: { setShowPhrase },
  } = useMnemonicPhrase(account.id, false)

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
        <MnemonicView
          header={
            <Flex gap="0.4375rem" mb="-0.4375rem">
              <h6>Mnemonic phrase</h6>
              {showPhrase && (
                <CopyToClipboardButton
                  value={phrase?.join(', ')}
                  copyTooltipText="Copy to clipboard"
                  copiedTooltipText="Copied"
                />
              )}
            </Flex>
          }
          loaded={!showPhrase || loaded}
          value={phrase || []}
          placeholder={''}
          onChange={() => null}
          isReadOnly={true}
          mb="2rem"
          wordsAmount={24}
          onBlinkingEyeClick={setShowPhrase}
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
