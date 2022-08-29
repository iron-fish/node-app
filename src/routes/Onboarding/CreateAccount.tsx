import {
  Box,
  Button,
  Flex,
  chakra,
  TextField,
  NAMED_COLORS,
  MnemonicView,
  Checkbox,
} from '@ironfish/ui-kit'
import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '..'
import BackButtonLink from 'Components/BackButtonLink'

const words = [
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

const CreateAccount: FC = () => {
  const [saved, setSaved] = useState<boolean>(false)
  return (
    <Flex flexDirection="column" p="4rem" pb="0" bg="transparent" w="100%">
      <BackButtonLink mb="2rem" to={ROUTES.ONBOARDING} label={'Go Back'} />
      <chakra.h1 mb="1.5rem" color={NAMED_COLORS.BLACK}>
        Create Account
      </chakra.h1>
      <chakra.h3 color={NAMED_COLORS.BLACK} pb="0.25rem">
        Internal Account Name
      </chakra.h3>
      <chakra.h5 mb="1rem" color={NAMED_COLORS.GREY}>
        This account name is only known to you
      </chakra.h5>
      <TextField label="Account Name" mb="2rem" w="100%" />
      <chakra.h3 color={NAMED_COLORS.BLACK} pb="0.25rem">
        Recovery Phrase
      </chakra.h3>
      <chakra.h5 mb="1rem" color={NAMED_COLORS.GREY}>
        Please keep this phrase stored somewhere safe. We will ask you to
        re-enter this.
      </chakra.h5>
      <MnemonicView
        header="Mnemonic Phrase"
        value={words}
        placeholder={''}
        onChange={() => null}
        isReadOnly={true}
        visible={true}
        mb="1rem"
      />
      <Box>
        <Checkbox
          mb="2rem"
          checked={saved}
          onChange={e => setSaved(e.target.checked)}
        >
          <chakra.h5 color={NAMED_COLORS.BLACK}>
            I saved my recovery phrase
          </chakra.h5>
        </Checkbox>
      </Box>
      <Box>
        <Button
          variant="primary"
          borderRadius="4rem"
          p="2rem"
          disabled={!saved}
          as={Link}
          to={ROUTES.ACCOUNTS}
        >
          Create Account
        </Button>
      </Box>
    </Flex>
  )
}

export default CreateAccount
