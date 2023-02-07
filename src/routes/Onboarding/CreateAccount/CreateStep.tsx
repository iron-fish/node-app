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
} from '@ironfish/ui-kit'
import { FC } from 'react'
import StepProps from './StepProps'

const CreateStep: FC<StepProps> = ({
  saved,
  setSaved,
  accountName,
  setAccountName,
  phrase,
  phraseLoaded,
  onNext,
  desktopMode,
}) => {
  const checkChanges: () => boolean = () => {
    return !saved || !accountName
  }

  return (
    <>
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
        loaded={phraseLoaded}
        header={
          <Flex gap="0.4375rem" mb="-0.4375rem">
            <h6>Mnemonic phrase</h6>
            <CopyToClipboardButton
              value={phrase?.join(', ')}
              copyTooltipText="CopyToClipBoard"
              copiedTooltipText="Copied"
            />
          </Flex>
        }
        value={phrase || []}
        placeholder={''}
        onChange={() => null}
        isReadOnly={true}
        visible={true}
        mb="1rem"
      />
      <Box>
        <Checkbox
          mb="2rem"
          isChecked={saved}
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
          onClick={onNext}
        >
          Next
        </Button>
      </Box>
    </>
  )
}

export default CreateStep
