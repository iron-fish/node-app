import {
  Box,
  Button,
  chakra,
  Flex,
  Link,
  MnemonicView,
  NAMED_COLORS,
  useColorModeValue,
} from '@ironfish/ui-kit'
import DetailsPanel from 'Components/DetailsPanel'
import PasswordField from 'Components/PasswordField'
import { FC, memo, useState, useEffect } from 'react'
import AccountKeysImage from 'Svgx/AccountKeysImage'
import LinkLaunchIcon from 'Svgx/LinkLaunch'
import { Account } from 'Data/types/Account'
import useAccountKeys from 'Hooks/accounts/useAccountKeys'
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
  const [spendingKey, setSpendingKey] = useState<string>('')
  const [nullifierKey, setNullifierKey] = useState<string>('')
  const [authKey, setAuthKey] = useState<string>('')
  const [proofAuthKey, setProofAuthKey] = useState<string>('')
  const [phrase, setMnemonicPhrase] = useState<string[]>([])

  const { data, loaded } = useAccountKeys(account?.identity)

  useEffect(() => {
    if (data && loaded) {
      setSpendingKey(data.spendingKey)
      setNullifierKey(data.nullifierKey)
      setAuthKey(data.authorizationKey)
      setProofAuthKey(data.proofAuthorizationKey)
      setMnemonicPhrase(data.mnemonicPhrase)
    }
  }, [data, loaded])

  const checkChanges: () => boolean = () => {
    return (
      loaded &&
      (spendingKey !== data.spendingKey ||
        nullifierKey !== data.nullifierKey ||
        authKey !== data.authorizationKey ||
        proofAuthKey !== data.proofAuthorizationKey ||
        !!phrase.find(
          (word, index) =>
            index !==
            data.mnemonicPhrase.findIndex(demo_word => demo_word === word)
        ))
    )
  }

  return (
    <Flex mb="4rem">
      <Box w="37.25rem">
        <PasswordField
          label="Spending Key"
          placeholder="Enter key"
          value={spendingKey}
          onChange={setSpendingKey}
          mb="2rem"
        />
        <MnemonicView
          header="Mnemonic Phrase"
          value={phrase}
          isReadOnly={true}
          placeholder="Empty"
          onChange={words => setMnemonicPhrase(words)}
          mb="2rem"
        />
        <PasswordField
          label="Nullifier Deriving Key"
          placeholder="Enter key"
          value={nullifierKey}
          onChange={setNullifierKey}
          mb="2rem"
        />
        <PasswordField
          label="Authorization Key"
          placeholder="Enter key"
          value={authKey}
          onChange={setAuthKey}
          mb="2rem"
        />
        <PasswordField
          label="Proof Authorization Key"
          placeholder="Enter key"
          value={proofAuthKey}
          onChange={setProofAuthKey}
          mb="2rem"
        />
        <Flex>
          <Button
            p="2rem"
            borderRadius="4.5rem"
            variant="primary"
            mr="2rem"
            disabled={!checkChanges()}
          >
            Save Changes
          </Button>
          <Link alignSelf="center">
            <h4>Export Account</h4>
          </Link>
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
