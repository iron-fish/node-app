import {
  Box,
  Button,
  Flex,
  chakra,
  TextField,
  useColorModeValue,
  NAMED_COLORS,
  MnemonicView,
  Checkbox,
} from '@ironfish/ui-kit'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '..'

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
  const textColor = useColorModeValue(
    NAMED_COLORS.GREY,
    NAMED_COLORS.LIGHTER_GREY
  )
  const [saved, setSaved] = useState<boolean>(false)
  return (
    <Flex flexDirection="column" p="4rem" pb="0" bg="transparent" w="100%">
      <Box>
        <Button
          mb="3rem"
          variant="link"
          leftIcon={<ChevronLeftIcon border="1px solid" borderRadius="50%" />}
          as={Link}
          to={ROUTES.ONBOARDING}
        >
          Go Вack
        </Button>
      </Box>
      <chakra.h1 mb="1rem">Create Account</chakra.h1>
      <chakra.h3>Internal Account Name</chakra.h3>
      <chakra.h5 mb="1rem" color={textColor}>
        This account name is only known to you
      </chakra.h5>
      <TextField label="Account Name" mb="2rem" w="100%" />
      <chakra.h3>Recovery Phrase</chakra.h3>
      <chakra.h5 mb="1rem" color={textColor}>
        Please keep this phrase stored somewhere safe. We will ask you to
        re-enter this.
      </chakra.h5>
      <MnemonicView
        header="Mnemonic Phrase"
        value={words}
        placeholder={''}
        onChange={() => { }}
        isReadOnly={true}
        mb="1rem"
      />
      <Box>
        <Checkbox
          mb="2rem"
          checked={saved}
          onChange={e => setSaved(e.target.checked)}
        >
          <chakra.h5>I saved my recovery phrase</chakra.h5>
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
