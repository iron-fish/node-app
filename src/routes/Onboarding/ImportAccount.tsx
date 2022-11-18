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
  HStack,
  MnemonicView,
  CopyToClipboardButton,
} from '@ironfish/ui-kit'
import { FC, useState, useCallback, useRef } from 'react'
import { ROUTES } from '..'
import IconEye from '@ironfish/ui-kit/dist/svgx/icon-eye'
import IconInfo from '@ironfish/ui-kit/dist/svgx/icon-info'
import BackButtonLink from 'Components/BackButtonLink'
import useImportAccount from 'Hooks/accounts/useImportAccount'
import { useNavigate } from 'react-router-dom'
import MnemonicPhraseType from 'Types/MnemonicPhraseType'
import CloseIcon from 'Svgx/CloseIcon'
import FileIcon from 'Svgx/FileIcon'
import { truncateHash } from 'Utils/hash'

interface DesktopModeProps {
  desktopMode?: boolean
  onImport?: VoidFunction
}

const SpendingKeyTab: FC<DesktopModeProps> = ({ desktopMode, onImport }) => {
  const [show, setShow] = useState(false)
  const [key, setKey] = useState('')
  const [importBySpendingKey] = useImportAccount()

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
        <Button
          variant="primary"
          isDisabled={!key}
          onClick={() => {
            importBySpendingKey(key).then(() => onImport())
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
  const [, , importByFile] = useImportAccount()
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
            importByFile(file).then(() => onImport())
          }}
        >
          Import Account
        </Button>
      </Box>
    </>
  )
}

const MnemonicPhraseTab: FC<DesktopModeProps> = ({ desktopMode, onImport }) => {
  const [phrase, setPhrase] = useState([])
  const [, importByMnemonicPhrase] = useImportAccount()
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
            importByMnemonicPhrase(phrase as MnemonicPhraseType).then(() =>
              onImport()
            )
          }}
          disabled={
            !phrase ||
            phrase.length < 12 ||
            phrase.findIndex(word => !word) !== -1
          }
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
  const handleOnImport = useCallback(() => {
    onImport()
    desktopMode && navigate(ROUTES.ACCOUNTS)
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
          <Tab>Spending Key</Tab>
          <Tab>Mnemonic Phrase</Tab>
          <Tab>File</Tab>
        </TabList>
        <TabPanels>
          <TabPanel w="100%" p={0}>
            <SpendingKeyTab
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
