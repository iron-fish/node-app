import {
  Button,
  chakra,
  LightMode,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  NAMED_COLORS,
  TextField,
} from '@ironfish/ui-kit'
import { FC, useState } from 'react'

const ConfirmModal: FC<
  Omit<ModalProps, 'children'> & {
    title: string
    description: string
    validationText: string
    onConfirm: () => void
    buttonText?: string
    buttonColor?: string
  }
> = ({
  onConfirm,
  title,
  description,
  validationText,
  buttonText = 'Confirm',
  buttonColor = '#F15929',
  ...props
}) => {
  const [textMatch, setTextMatch] = useState(false)

  const handleConfirm = () => {
    if (textMatch) {
      onConfirm()
    }
  }

  return (
    <LightMode>
      <Modal {...props}>
        <ModalOverlay background="rgba(0,0,0,0.75)" />
        <ModalContent p="4rem" minW="40rem" color={NAMED_COLORS.DEEP_BLUE}>
          <ModalCloseButton
            border="0.0625rem solid"
            borderRadius="50%"
            color={NAMED_COLORS.GREY}
            borderColor={NAMED_COLORS.LIGHT_GREY}
            top="1.5rem"
            right="1.5rem"
            w="2.375rem"
            h="2.375rem"
            _focus={{
              boxShadow: 'none',
            }}
          />
          <ModalHeader>
            <chakra.h2>{title}</chakra.h2>
          </ModalHeader>
          <ModalBody>
            <chakra.h4 marginBottom="16px">{description}</chakra.h4>
            <TextField
              label={`Enter "${validationText}" to confirm`}
              placeholder={validationText}
              InputProps={{
                onChange: e => setTextMatch(e.target.value === validationText),
              }}
            />
          </ModalBody>
          <ModalFooter justifyContent="flex-start">
            <Button
              variant="primary"
              size="medium"
              isDisabled={!textMatch}
              onClick={handleConfirm}
              backgroundColor={buttonColor}
              mr="1.5rem"
            >
              {buttonText}
            </Button>
            <Link
              alignSelf="center"
              onClick={() => {
                props.onClose()
              }}
            >
              <h4>Cancel</h4>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LightMode>
  )
}

export default ConfirmModal
