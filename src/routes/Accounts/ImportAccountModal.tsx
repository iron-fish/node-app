import { FC, useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  Flex,
  chakra,
  Box,
  Button,
  NAMED_COLORS,
  MnemonicView,
  TextField,
  ModalProps,
  ModalOverlay,
  ModalContent,
  LightMode,
  HStack,
  Input,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from '@ironfish/ui-kit'
import IconEye from '@ironfish/ui-kit/dist/svgx/icon-eye'
import IconInfo from '@ironfish/ui-kit/dist/svgx/icon-info'

type CreateAccountModalProps = Omit<ModalProps, 'children'>

const SpendingKeyTab: FC = () => {
  const [show, setShow] = useState(false)
  const [key, setKey] = useState('')

  return (
    <>
      <TextField
        label="Key"
        InputProps={{
          onChange: e => setKey(e.target.value),
          type: show ? 'text' : 'password',
          placeholder: 'Enter key',
        }}
        value={key}
        my="2rem"
        RightAddons={
          <HStack marginLeft={'2.5rem'} spacing={'0.875rem'}>
            <IconEye
              cursor="pointer"
              crossed={show}
              onClick={() => setShow(!show)}
            />
            <IconInfo cursor={'pointer'} />
          </HStack>
        }
      />
      <Box>
        <Button variant="primary" size="large" w="100%" isDisabled={!key}>
          Import Account
        </Button>
      </Box>
    </>
  )
}

const ImportFileTab: FC = () => {
  const [file, setFile] = useState<File | null>(null)
  return (
    <>
      <chakra.h5 mb="1rem" mt="2rem" color={NAMED_COLORS.GREY}>
        Upload your JSON file to import your account
      </chakra.h5>
      <Box>
        <Button variant="secondary" borderRadius="4rem">
          Browse Files
          <Input
            type="file"
            height="100%"
            width="100%"
            position="absolute"
            top="0"
            left="0"
            opacity="0"
            aria-hidden="true"
            accept="application/JSON"
            onChange={e => setFile(e.target.files[0])}
          />
        </Button>
      </Box>
      <Box>
        <Button
          variant="primary"
          size="large"
          w="100%"
          mt="2rem"
          isDisabled={!file}
        >
          Import Account
        </Button>
      </Box>
    </>
  )
}

const MnemonicPhraseTab: FC = () => {
  const [phrase, setPhrase] = useState([])
  return (
    <>
      <chakra.h3 pb="0.25rem" mt="2rem">
        Mnemonic Phrase
      </chakra.h3>
      <chakra.h5 mb="1rem" color={NAMED_COLORS.GREY}>
        Fill out your recovery phrase in the proper order
      </chakra.h5>
      <MnemonicView
        value={phrase}
        header="Mnemonic Phrase"
        placeholder="Empty"
        visible={true}
        isReadOnly={false}
        onChange={newWords => setPhrase(newWords)}
      />
      <Box>
        <Button
          variant="primary"
          size="large"
          mt="2rem"
          w="100%"
          isDisabled={
            !phrase ||
            phrase.length < 12 ||
            phrase.findIndex(word => !word) !== -1
          }
        >
          Import Account
        </Button>
      </Box>
    </>
  )
}

const ImportAccountModal: FC<CreateAccountModalProps> = props => {
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
                Import With
              </chakra.h3>
              <Tabs>
                <TabList>
                  <Tab>Spending Key</Tab>
                  <Tab>Mnemonic Phrase</Tab>
                  <Tab>File</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel w="100%" p={0}>
                    <SpendingKeyTab />
                  </TabPanel>
                  <TabPanel w="100%" p={0}>
                    <MnemonicPhraseTab />
                  </TabPanel>
                  <TabPanel w="100%" p={0}>
                    <ImportFileTab />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </LightMode>
  )
}

export default ImportAccountModal
