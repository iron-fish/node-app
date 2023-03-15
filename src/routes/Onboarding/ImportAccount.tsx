import {
  Box,
  Button,
  Flex,
  chakra,
  Input,
  NAMED_COLORS,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  TextField,
  MnemonicView,
  useIronToast,
  Textarea,
  FONTS,
} from '@ironfish/ui-kit'
import { FC, useState, useCallback, useRef } from 'react'
import { ROUTES } from '..'
import BackButtonLink from 'Components/BackButtonLink'
import useImportAccount from 'Hooks/accounts/useImportAccount'
import { useNavigate } from 'react-router-dom'
import CloseIcon from 'Svgx/CloseIcon'
import FileIcon from 'Svgx/FileIcon'
import { truncateHash } from 'Utils/hash'

interface DesktopModeProps {
  desktopMode?: boolean
  onImport?: VoidFunction
}

const EncodedKeyTab: FC<DesktopModeProps> = ({ desktopMode, onImport }) => {
  const [data, setData] = useState('')
  const [importBySpendingKey] = useImportAccount()

  return (
    <>
      <Textarea
        value={data}
        onChange={e => setData(e.target.value.trim())}
        placeholder={'Enter encoded key'}
        my="2rem"
        h="12.5rem"
        resize="none"
        sx={{
          borderRadius: '0.25rem',
          border: '0.063rem solid',
          borderColor: NAMED_COLORS.LIGHT_GREY,
          boxShadow: '0 0.25rem 0.688rem rgba(0, 0, 0, 0.04)',
          transition: 'border-color 300ms ease-in',
          fontSize: '1rem',
          px: '0.625rem',
          fontWeight: '400',
          fontFamily: FONTS.FAVORIT,
          color: NAMED_COLORS.DEEP_BLUE,
          _hover: {
            borderColor: NAMED_COLORS.DEEP_BLUE,
          },
          _focusWithin: {
            borderColor: NAMED_COLORS.DEEP_BLUE,
          },
          _focusVisible: {
            boxShadow: 'none',
          },
          _placeholder: {
            color: NAMED_COLORS.GREY,
          },
        }}
      />
      <Box>
        <Button
          variant="primary"
          isDisabled={!data}
          onClick={() => {
            importBySpendingKey(data).then(() => onImport())
          }}
          size="large"
          w={desktopMode ? undefined : '100%'}
        >
          Import Account
        </Button>
      </Box>
    </>
  )
}

const ImportFileTab: FC<DesktopModeProps> = ({ desktopMode, onImport }) => {
  const [file, setFile] = useState<File | null>(null)
  const [importAccountByData, , importByFile] = useImportAccount()
  const fileInput = useRef<HTMLInputElement>()
  return (
    <>
      <chakra.h5 mb="1rem" mt="2rem" color={NAMED_COLORS.GREY}>
        Upload your JSON file to import your account
      </chakra.h5>
      <Flex>
        <Button
          minW="8.75rem"
          variant="secondary"
          borderRadius="4rem"
          onClick={() => {
            if (!file) {
              fileInput.current.value = ''
            }
          }}
        >
          Browse Files
          <Input
            ref={fileInput}
            type="file"
            height="100%"
            width="100%"
            position="absolute"
            top="0"
            left="0"
            opacity="0"
            aria-hidden="true"
            accept="application/JSON"
            onChange={e => {
              setFile(e.target.files[0])
            }}
          />
        </Button>
        {file && (
          <Flex ml="34px" alignSelf="center" alignItems="center">
            <FileIcon mr="8px" />
            <chakra.h5 color={NAMED_COLORS.BLACK}>
              {file.name.length > 32
                ? truncateHash(file.name, 2, 14)
                : file.name}
            </chakra.h5>
            <CloseIcon
              ml="27px"
              width="9xp"
              height="9px"
              color={NAMED_COLORS.GREY}
              cursor="pointer"
              onClick={() => setFile(null)}
            />
          </Flex>
        )}
      </Flex>
      <Box>
        <Button
          variant="primary"
          mt="2rem"
          isDisabled={!file}
          size="large"
          w={desktopMode ? undefined : '100%'}
          onClick={() => {
            const reader = new FileReader()
            reader.onload = e => {
              const content = e.target.result
              try {
                const data = JSON.parse(content.toString())
                importByFile(data)
                  .then(() => onImport())
                  .catch(() => {
                    // TODO: add toast
                  })
              } catch (error) {
                importAccountByData(content.toString())
                  .then(() => onImport())
                  .catch(() => {
                    // TODO: add toast
                  })
              }
            }
            reader.readAsText(file)
          }}
        >
          Import Account
        </Button>
      </Box>
    </>
  )
}

const MnemonicPhraseTab: FC<DesktopModeProps> = ({ desktopMode, onImport }) => {
  const [phrase, setPhrase] = useState([''])
  const [name, setName] = useState('')
  const [, importByMnemonicPhrase] = useImportAccount()
  return (
    <>
      <chakra.h3 pb="0.25rem" mt="2rem">
        Mnemonic Phrase
      </chakra.h3>
      <chakra.h5 mb="1rem" color={NAMED_COLORS.GREY}>
        Fill out your recovery phrase in the proper order
      </chakra.h5>
      <TextField
        label="Name"
        InputProps={{
          onChange: e => setName(e.target.value.trim()),
          placeholder: 'Enter account name',
        }}
        value={name}
        mb="2rem"
      />
      <MnemonicView
        value={phrase}
        header={<h6>Mnemonic phrase</h6>}
        wordsAmount={24}
        placeholder="Empty"
        visible={true}
        isReadOnly={false}
        onChange={newWords => setPhrase(newWords)}
      />
      <Box>
        <Button
          variant="primary"
          mt="2rem"
          onClick={() => {
            importByMnemonicPhrase(name, phrase.join(' ')).then(() =>
              onImport()
            )
          }}
          isDisabled={!name || phrase.findIndex(word => !word) !== -1}
          size="large"
          w={desktopMode ? undefined : '100%'}
        >
          Import Account
        </Button>
      </Box>
    </>
  )
}

const ImportAccount: FC<DesktopModeProps> = ({
  desktopMode = true,
  onImport = () => undefined,
}) => {
  const navigate = useNavigate()
  const toast = useIronToast({
    title: 'Account Imported',
    containerStyle: {
      mb: '1rem',
    },
  })

  const handleOnImport = useCallback(() => {
    onImport()
    desktopMode && navigate(ROUTES.ACCOUNTS)
    toast()
  }, [onImport])

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
          <chakra.h1 color={NAMED_COLORS.BLACK} mb="1.5rem">
            Import Account
          </chakra.h1>
        </>
      )}
      <chakra.h3 color={NAMED_COLORS.BLACK} pb="0.25rem">
        Import With
      </chakra.h3>
      <Tabs>
        <TabList>
          <Tab>Encoded Key</Tab>
          <Tab>Mnemonic Phrase</Tab>
          <Tab>File</Tab>
        </TabList>
        <TabPanels>
          <TabPanel w="100%" p={0}>
            <EncodedKeyTab
              desktopMode={desktopMode}
              onImport={handleOnImport}
            />
          </TabPanel>
          <TabPanel w="100%" p={0}>
            <MnemonicPhraseTab
              desktopMode={desktopMode}
              onImport={handleOnImport}
            />
          </TabPanel>
          <TabPanel w="100%" p={0}>
            <ImportFileTab
              desktopMode={desktopMode}
              onImport={handleOnImport}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

export default ImportAccount
