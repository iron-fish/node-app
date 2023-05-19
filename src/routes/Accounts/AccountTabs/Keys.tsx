import {
  Box,
  Button,
  chakra,
  Flex,
  NAMED_COLORS,
  Spinner,
  MnemonicView,
  CopyToClipboardButton,
  SelectField,
} from '@ironfish/ui-kit'
import DetailsPanel from 'Components/DetailsPanel'
import { FC, memo, useState } from 'react'
import AccountKeysImage from 'Svgx/AccountKeysImage'
import LinkLaunchIcon from 'Svgx/LinkLaunch'
import DownloadIcon from '@ironfish/ui-kit/dist/svgx/download-icon'
import Account from 'Types/Account'
import useMnemonicPhrase from 'Hooks/accounts/useMnemonicPhrase'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'

interface AccountKeysProps {
  account: Account
  exportAccount: (id: string, encoded?: boolean) => Promise<string>
}

const Information: FC = memo(() => {
  return (
    <Box maxWidth="21.5rem">
      <chakra.h3 mb="1rem">Keys</chakra.h3>
      <chakra.h5
        mb="2rem"
        color={NAMED_COLORS.GREY}
        _dark={{ color: NAMED_COLORS.LIGHT_GREY }}
      >
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

const EXPORT_OPTIONS = [
  { label: 'JSON', value: false },
  { label: 'Encoded', value: true },
]

const AccountKeys: FC<AccountKeysProps> = ({ account, exportAccount }) => {
  const [exporting, setExporting] = useState<boolean>(false)
  const [exportType, setExportType] = useState<OptionType>(EXPORT_OPTIONS[1])
  const { data: phrase, loaded } = useMnemonicPhrase(account.id, true)

  const handleExport = () => {
    setExporting(true)
    exportAccount(account.id, exportType.value)
      .then(exportedAccount => {
        const file = new Blob([exportedAccount], { type: 'text/plain' })
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
              <CopyToClipboardButton
                value={phrase?.join(' ')}
                copyTooltipText="Copy to clipboard"
                copiedTooltipText="Copied"
              />
            </Flex>
          }
          loaded={loaded}
          value={phrase || []}
          placeholder={''}
          onChange={() => null}
          isReadOnly={true}
          mb="2rem"
          wordsAmount={24}
        />
        <Flex alignItems={'center'} gap="2rem">
          <SelectField
            label="Export format"
            size="small"
            value={exportType}
            options={EXPORT_OPTIONS}
            onSelectOption={setExportType}
          />
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
