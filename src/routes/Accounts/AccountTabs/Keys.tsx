import {
  Box,
  Button,
  chakra,
  Flex,
  MnemonicView,
  NAMED_COLORS,
  useColorModeValue,
  CopyToClipboardButton,
} from '@ironfish/ui-kit'
import DetailsPanel from 'Components/DetailsPanel'
import { FC, memo, useState, useEffect } from 'react'
import AccountKeysImage from 'Svgx/AccountKeysImage'
import LinkLaunchIcon from 'Svgx/LinkLaunch'
import { Account } from 'Data/types/Account'
import useAccountKeys from 'Hooks/accounts/useAccountKeys'
import MnemonicPhraseType from 'Types/MnemonicPhraseType'
import DownloadIcon from '@ironfish/ui-kit/dist/svgx/download-icon'

interface AccountKeysProps {
  account: Account
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

const AccountKeys: FC<AccountKeysProps> = ({ account }) => {
  const [phrase, setMnemonicPhrase] = useState<MnemonicPhraseType>()

  const [{ data, loaded }] = useAccountKeys(account?.identity)

  useEffect(() => {
    if (data && loaded) {
      setMnemonicPhrase(data.mnemonicPhrase)
    }
  }, [data, loaded])

  return (
    <Flex mb="4rem">
      <Box w="37.25rem">
        <MnemonicView
          header={
            <Flex gap="0.4375rem" alignItems="baseline">
              <h6>Mnemonic phrase</h6>
              <CopyToClipboardButton
                value={phrase?.join(', ')}
                copyTooltipText="CopyToClipBoard"
                copiedTooltipText="Copied"
              />
            </Flex>
          }
          value={phrase}
          isReadOnly={true}
          placeholder="Empty"
          onChange={words => setMnemonicPhrase(words as MnemonicPhraseType)}
          mb="2rem"
        />
        <Flex>
          <Button
            variant="primary"
            size="medium"
            mr="2rem"
            as="a"
            href={
              'data:text/plain;charset=utf-8,' +
              encodeURIComponent(JSON.stringify(phrase))
            }
            download="keys.json"
            leftIcon={<DownloadIcon />}
          >
            Export Keys
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
