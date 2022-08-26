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
import { Link } from 'react-router-dom'
import { ROUTES } from '..'
import IconEye from '@ironfish/ui-kit/dist/svgx/icon-eye'
import IconInfo from '@ironfish/ui-kit/dist/svgx/icon-info'
import BackButtonLink from 'Components/BackButtonLink'

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
        <Button
          variant="primary"
          borderRadius="4rem"
          p="2rem"
          as={Link}
          to={ROUTES.ACCOUNTS}
          disabled={!key}
          _disabled={{
            pointerEvents: 'none',
            opacity: '0.4',
          }}
        >
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
          borderRadius="4rem"
          mt="2rem"
          p="2rem"
          as={Link}
          to={ROUTES.ACCOUNTS}
          disabled={!file}
          _disabled={{
            pointerEvents: 'none',
            opacity: '0.4',
          }}
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
      <chakra.h3 mt="2rem">Mnemonic Phrase</chakra.h3>
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
          borderRadius="4rem"
          mt="2rem"
          p="2rem"
          as={Link}
          to={ROUTES.ACCOUNTS}
          disabled={
            !phrase ||
            phrase.length < 12 ||
            phrase.findIndex(word => !word) !== -1
          }
          _disabled={{
            pointerEvents: 'none',
            opacity: '0.4',
          }}
        >
          Import Account
        </Button>
      </Box>
    </>
  )
}

const ImportAccount: FC = () => {
  return (
    <Flex flexDirection="column" p="4rem" pb="0" bg="transparent" w="100%">
      <BackButtonLink mb="2rem" to={ROUTES.ONBOARDING} label={'Go Back'} />
      <chakra.h1 color={NAMED_COLORS.BLACK} mb="1rem">
        Import Account
      </chakra.h1>
      <chakra.h3 color={NAMED_COLORS.BLACK}>Import With</chakra.h3>
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
  )
}

export default ImportAccount
