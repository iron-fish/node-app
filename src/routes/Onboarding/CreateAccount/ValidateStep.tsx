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
  isInvalid?: boolean
  isInvalidInputs?: boolean[]
}

const ValidateStep: FC<StepProps> = ({
  desktopMode,
  phrase,
  handleCreateAccount,
  onBack,
}) => {
  const [inputtedPhrase, setInputtedPhrase] = useState<string[]>([])
  const [error, setError] = useState<MnemonicValidationError>({})
  const originalPhrase = phrase.join('')

  const checkChanges = () => {
    return originalPhrase !== inputtedPhrase.join('')
  }

  useEffect(() => {
    const filledCells = inputtedPhrase.filter(i => !!i)
    const inputError: MnemonicValidationError = {
      isInvalid: false,
      isInvalidInputs: [],
    }
    if (filledCells.length === phrase.length && checkChanges()) {
      inputError.isInvalid = true
      inputError.header = 'Incorrect recovery phrase'
      inputError.message =
        'The phrase you entered is incorrect. Either the phrase is invalid or your words are out of order.'
      setError(inputError)
    } else if (filledCells.length > 0 && filledCells.length === phrase.length) {
      setError(inputError)
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
        isInvalid={error.isInvalid}
        isInvalidInputs={error.isInvalidInputs}
        onBlur={event => {
          if (event.currentTarget.contains(event.relatedTarget)) {
            return
          }
          const filledCells = inputtedPhrase.filter(i => !!i)
          const inputError: MnemonicValidationError = {
            isInvalid: false,
            isInvalidInputs: [],
          }
          if (filledCells.length > 0 && filledCells.length < phrase.length) {
            inputError.isInvalid = true
            inputError.header = 'Please fill out your entire phrase'
            inputError.message =
              'You’re missing one or more words in your seed phrase. Fill out the words in highlighted in red.'
            inputError.isInvalidInputs = inputtedPhrase.map(i => !i)
            setError(inputError)
          }
        }}
        wordsAmount={phrase.length}
      />
      {error?.header && error?.message && (
        <Box mt="0.75rem">
          <chakra.h5 color={NAMED_COLORS.RED} mb="0.5rem">
            {error.header}
          </chakra.h5>
          <chakra.h6 color={NAMED_COLORS.BLACK}>{error.message}</chakra.h6>
        </Box>
      )}
      <Flex gap="1rem">
        {!desktopMode && (
          <Box mt="2rem">
            <Button variant="primary" size="large" onClick={onBack}>
              Back
            </Button>
          </Box>
        )}
        <Box mt="2rem">
          <Button
            variant="primary"
            isDisabled={checkChanges()}
            size="large"
            onClick={handleCreateAccount}
          >
            Create Account
          </Button>
        </Box>
      </Flex>
    </>
  )
}

export default ValidateStep
