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
import { FC, memo, useState } from 'react'
import AccountKeysImage from 'Svgx/AccountKeysImage'
import LinkLaunchIcon from 'Svgx/LinkLaunch'

interface AccountKeysProps {
  id: string
}

const DEMO_PHRASE = [
  'Carrot',
  'Stick',
  'Papercut',
  'Phone',
  'Keyboard',
  'Walkway',
  'Uppercut',
  'Ball',
  'Pants',
  'Test',
  'Grass',
  'Milk',
]
const DEMO_KEY =
  '00000000000700ab5bb09f2129eae83a7c7dd6c8376e2252f4b6b3629affa359'

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

const AccountKeys: FC<AccountKeysProps> = props => {
  const [spendingKey, setSpendingKey] = useState<string>(DEMO_KEY)
  const [nullifierKey, setNullifierKey] = useState<string>(DEMO_KEY)
  const [authKey, setAuthKey] = useState<string>(DEMO_KEY)
  const [proofAuthKey, setProofAuthKey] = useState<string>(DEMO_KEY)
  const [phrase, setMnemomicPhrase] = useState<string[]>(DEMO_PHRASE)

  const checkChanges: () => boolean = () => {
    return (
      spendingKey !== DEMO_KEY ||
      nullifierKey !== DEMO_KEY ||
      authKey !== DEMO_KEY ||
      proofAuthKey !== DEMO_KEY ||
      !!phrase.find(
        (word, index) =>
          index !== DEMO_PHRASE.findIndex(demo_word => demo_word === word)
      )
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
          onChange={words => setMnemomicPhrase(words)}
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
            isDisabled={!checkChanges()}
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
