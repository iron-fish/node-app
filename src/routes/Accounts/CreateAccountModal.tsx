import { FC, useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  Flex,
  chakra,
  Box,
  Checkbox,
  Button,
  NAMED_COLORS,
  MnemonicView,
  TextField,
  ModalProps,
  ModalOverlay,
  ModalContent,
  LightMode,
} from '@ironfish/ui-kit'

type CreateAccountModalProps = Omit<ModalProps, 'children'>

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

const CreateAccountModal: FC<CreateAccountModalProps> = props => {
  const [saved, setSaved] = useState<boolean>(false)
  return (
    <LightMode>
      <Modal closeOnOverlayClick={false} {...props}>
        <ModalOverlay />
        <ModalContent
          w="45rem"
          maxW="45rem"
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
          <ModalBody p={0}>
            <Flex flexDirection="column" pb="0" bg="transparent" w="100%">
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
                Please keep this phrase stored somewhere safe. We will ask you
                to re-enter this.
              </chakra.h5>
              <MnemonicView
                header="Mnemonic Phrase"
                value={words}
                placeholder={''}
                onChange={() => ({})}
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
              <Button
                variant="primary"
                size="large"
                isDisabled={!saved}
                w="100%"
              >
                Create Account
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </LightMode>
  )
}

export default CreateAccountModal
