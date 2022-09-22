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
} from '@ironfish/ui-kit'
import { FC, useState } from 'react'
import { ROUTES } from '..'
import IconEye from '@ironfish/ui-kit/dist/svgx/icon-eye'
import IconInfo from '@ironfish/ui-kit/dist/svgx/icon-info'
import BackButtonLink from 'Components/BackButtonLink'
import useImportAccount from 'Hooks/accounts/useImportAccount'
import { useNavigate } from 'react-router-dom'
import { MnemonicPhraseType } from 'Types/AsyncDataType'

interface DesktopModeProps {
  desktopMode?: boolean
  afterImport?: VoidFunction
}

const SpendingKeyTab: FC<DesktopModeProps> = ({ desktopMode, afterImport }) => {
  const [show, setShow] = useState(false)
  const [key, setKey] = useState('')
  const navigate = useNavigate()
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
            importBySpendingKey(key).then(() => {
              afterImport()
              desktopMode && navigate(ROUTES.ACCOUNTS)
            })
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

const ImportFileTab: FC<DesktopModeProps> = ({ desktopMode, afterImport }) => {
  const [file, setFile] = useState<File | null>(null)
  const navigate = useNavigate()
  const [, , importByFile] = useImportAccount()
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
          mt="2rem"
          isDisabled={!file}
          size="large"
          w={desktopMode ? undefined : '100%'}
          // onClick={onImport}
          onClick={() => {
            importByFile(file).then(() => {
              afterImport()
              desktopMode && navigate(ROUTES.ACCOUNTS)
            })
          }}
        >
          Import Account
        </Button>
      </Box>
    </>
  )
}

const MnemonicPhraseTab: FC<DesktopModeProps> = ({
  desktopMode,
  afterImport,
}) => {
  const [phrase, setPhrase] = useState([])
  const navigate = useNavigate()
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
        header="Mnemonic Phrase"
        placeholder="Empty"
        visible={true}
        isReadOnly={false}
        onChange={newWords => setPhrase(newWords)}
      />
      <Box>
        <Button
          variant="primary"
          mt="2rem"
          p="2rem"
          onClick={() => {
            importByMnemonicPhrase(phrase as MnemonicPhraseType).then(() => {
              afterImport()
              desktopMode && navigate(ROUTES.ACCOUNTS)
            })
          }}
          disabled={
            !phrase ||
            phrase.length < 12 ||
            phrase.findIndex(word => !word) !== -1
          }
          size="large"
          w={desktopMode ? undefined : '100%'}
          // onClick={onImport}
        >
          Import Account
        </Button>
      </Box>
    </>
  )
}

const ImportAccount: FC<DesktopModeProps> = ({
  desktopMode = true,
  afterImport = () => ({}),
}) => {
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
              afterImport={afterImport}
            />
          </TabPanel>
          <TabPanel w="100%" p={0}>
            <MnemonicPhraseTab
              desktopMode={desktopMode}
              afterImport={afterImport}
            />
          </TabPanel>
          <TabPanel w="100%" p={0}>
            <ImportFileTab
              desktopMode={desktopMode}
              afterImport={afterImport}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

export default ImportAccount
