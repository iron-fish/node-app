import {
  Box,
  Button,
  Flex,
  chakra,
  NAMED_COLORS,
  MnemonicView,
} from '@ironfish/ui-kit'
import { FC, useState, useEffect } from 'react'
import StepProps from './StepProps'

interface MnemonicValidationError {
  header?: string
  message?: string
  inputError?: {
    isInvalid: boolean
    errors: boolean[]
  }
}

const ValidateStep: FC<StepProps> = ({
  desktopMode,
  phrase,
  handleCreateAccount,
}) => {
  const [inputtedPhrase, setInputtedPhrase] = useState<string[]>([])
  const [error, setError] = useState<MnemonicValidationError>({})
  const originalPhrase = phrase.join('')

  const checkChanges = () => {
    return originalPhrase !== inputtedPhrase.join('')
  }

  useEffect(() => {
    const filledCells = inputtedPhrase.filter(i => !!i)
    const inputError = {
      isInvalid: false,
      errors: inputtedPhrase.map(i => !i),
    }
    if (filledCells.length > 0 && filledCells.length < phrase.length) {
      inputError.isInvalid = true
      setError({
        header: 'Please fill out your entire phrase',
        message:
          'You’re missing one or more words in your seed phrase. Fill out the words in highlighted in red.',
        inputError,
      })
    } else if (filledCells.length > 0 && checkChanges()) {
      inputError.isInvalid = true
      setError({
        header: 'Incorrect recovery phrase',
        message:
          'The phrase you entered is incorrect. Either the phrase is invalid or your words are out of order.',
        inputError,
      })
    } else {
      setError({ inputError })
    }
  }, [inputtedPhrase])

  return (
    <>
      <chakra.h3 color={NAMED_COLORS.BLACK} pb="0.25rem">
        Confirm Your Recovery Phase
      </chakra.h3>
      <chakra.h5 mb="1rem" color={NAMED_COLORS.GREY}>
        Please keep this phrase stored somewhere safe. We will ask you to
        re-enter this.
      </chakra.h5>
      <MnemonicView
        header={
          <Flex gap="0.4375rem" mb="-0.4375rem">
            <h6>Mnemonic phrase</h6>
          </Flex>
        }
        value={inputtedPhrase}
        placeholder="Empty"
        onChange={setInputtedPhrase}
        visible={true}
        isReadOnly={false}
        error={error?.inputError}
      />
      {error && (
        <Box mt="0.75rem">
          <chakra.h5 color={NAMED_COLORS.RED} mb="0.5rem">
            {error.header}
          </chakra.h5>
          <chakra.h6 color={NAMED_COLORS.BLACK}>{error.message}</chakra.h6>
        </Box>
      )}
      <Box mt="2rem">
        <Button
          variant="primary"
          isDisabled={checkChanges()}
          size="large"
          w={desktopMode ? undefined : '100%'}
          onClick={handleCreateAccount}
        >
          Create Account
        </Button>
      </Box>
    </>
  )
}

export default ValidateStep
