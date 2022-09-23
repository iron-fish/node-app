import { FC } from 'react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  NAMED_COLORS,
  ModalProps,
  ModalOverlay,
  ModalContent,
  LightMode,
} from '@ironfish/ui-kit'

const ModalWindow: FC<ModalProps> = ({ children, ...props }) => {
  return (
    <LightMode>
      <Modal closeOnOverlayClick={false} {...props}>
        <ModalOverlay />
        <ModalContent
          w="47rem"
          maxW="47rem"
          p="4rem"
          color={NAMED_COLORS.DEEP_BLUE}
        >
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
          <ModalBody p={0}>{children}</ModalBody>
        </ModalContent>
      </Modal>
    </LightMode>
  )
}

export default ModalWindow
