import {
  Box,
  Button,
  Flex,
  chakra,
  TextField,
  NAMED_COLORS,
  MnemonicView,
  Checkbox,
  CopyToClipboardButton,
  useIronToast,
} from '@ironfish/ui-kit'
import { FC, useState } from 'react'
import { ROUTES } from '..'
import BackButtonLink from 'Components/BackButtonLink'
import useCreateAccount from 'Hooks/accounts/useCreateAccount'
import MnemonicPhraseType from 'Types/MnemonicPhraseType'

interface CreateAccountProps {
  desktopMode?: boolean
  onCreate?: VoidFunction
}

const CreateAccount: FC<CreateAccountProps> = ({
  desktopMode = true,
  onCreate = () => undefined,
}) => {
  const [saved, setSaved] = useState<boolean>(false)
  const [accountName, setAccountName] = useState<string>('')
  const {
    data: account,
    loaded,
    actions: { confirmAccountCreation },
  } = useCreateAccount()
  const toast = useIronToast({
    title: 'Account Created',
    containerStyle: {
      mb: '1rem',
    },
  })

  const checkChanges: () => boolean = () => {
    return !saved || !accountName
  }

  return (
    <Flex
      flexDirection="column"
      p={desktopMode ? '4rem' : 0}
      pb="0"
      bg="transparent"
      w="100%"
    >
      {desktopMode && (
        <>
          <BackButtonLink mb="2rem" to={ROUTES.ONBOARDING} label={'Go Back'} />
          <chakra.h1 mb="1.5rem" color={NAMED_COLORS.BLACK}>
            Create Account
          </chakra.h1>
        </>
      )}
      <chakra.h3 color={NAMED_COLORS.BLACK} pb="0.25rem">
        Internal Account Name
      </chakra.h3>
      <chakra.h5 mb="1rem" color={NAMED_COLORS.GREY}>
        This account name is only known to you
      </chakra.h5>
      <TextField
        label="Account Name"
        mb="2rem"
        w="100%"
        value={accountName}
        InputProps={{
          onChange: e => setAccountName(e.target.value),
        }}
      />
      <chakra.h3 color={NAMED_COLORS.BLACK} pb="0.25rem">
        Recovery Phrase
      </chakra.h3>
      <chakra.h5 mb="1rem" color={NAMED_COLORS.GREY}>
        Please keep this phrase stored somewhere safe. We will ask you to
        re-enter this.
      </chakra.h5>
      <MnemonicView
        loaded={loaded}
        header={
          <Flex gap="0.4375rem" mb="-0.4375rem">
            <h6>Mnemonic phrase</h6>
            <CopyToClipboardButton
              value={account?.mnemonicPhrase?.join(', ')}
              copyTooltipText="CopyToClipBoard"
              copiedTooltipText="Copied"
            />
          </Flex>
        }
        value={account?.mnemonicPhrase || []}
        placeholder={''}
        onChange={() => null}
        isReadOnly={true}
        visible={true}
        mb="1rem"
        wordsAmount={24}
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
          isDisabled={checkChanges()}
          size="large"
          w={desktopMode ? undefined : '100%'}
          onClick={() => {
            confirmAccountCreation(accountName).then(() => {
              onCreate()
              toast()
            })
          }}
        >
          Create Account
        </Button>
      </Box>
    </Flex>
  )
}

export default CreateAccount
