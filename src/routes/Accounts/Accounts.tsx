import { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  chakra,
  NAMED_COLORS,
  useColorModeValue,
} from '@ironfish/ui-kit'
import IconAdd from '@ironfish/ui-kit/dist/svgx/icon-add'
import SearchSortField from 'Components/Search&Sort'
import AccountPreview from 'Routes/Accounts/AccountPreview'
import ModalWindow from 'Components/ModalWindow'
import ImportAccount from 'Routes/Onboarding/ImportAccount'
import CreateAccount from 'Routes/Onboarding/CreateAccount'

const DEMO_DATA = [
  {
    name: 'Primary Account',
    balance: 8.456,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Secondary Account',
    balance: 1.944,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'No transactions',
    balance: 56,
    address: 'emptynft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 4',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 5',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 6',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 7',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 8',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 9',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 10',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 11',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 12',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
]

const Accounts = () => {
  const [showCreateAccount, setShowCreateAccount] = useState(false)
  const [showImportAccount, setShowImportAccount] = useState(false)
  const $colors = useColorModeValue(
    { subHeader: NAMED_COLORS.GREY },
    { subHeader: NAMED_COLORS.PALE_GREY }
  )
  return (
    <>
      <Flex
        mb="2.5rem"
        justifyContent="space-between"
        w="100%"
        alignItems="center"
      >
        <Flex direction="column">
          <Box>
            <h2>Privacy Accounts</h2>
          </Box>
          <Flex>
            <chakra.h5 color={$colors.subHeader}>
              Total accounts balance:
            </chakra.h5>
            &nbsp;
            <h5>
              <b>10,456 $IRON</b>
            </h5>
          </Flex>
        </Flex>
        <Flex>
          <Button
            leftIcon={<IconAdd mr="-0.25rem" />}
            mr="1rem"
            borderRadius="4rem"
            variant="secondary"
            onClick={() => setShowCreateAccount(true)}
          >
            <chakra.h5 mt="0.125rem">Create Account</chakra.h5>
          </Button>
          <Button
            leftIcon={<IconAdd mr="-0.25rem" />}
            borderRadius="4rem"
            variant="secondary"
            onClick={() => setShowImportAccount(true)}
          >
            <chakra.h5 mt="0.125rem">Import Account</chakra.h5>
          </Button>
        </Flex>
      </Flex>
      <SearchSortField />
      <Flex mt="0.5rem" direction="column" width="100%">
        {DEMO_DATA.map((data, index) => (
          <AccountPreview {...data} order={index} />
        ))}
      </Flex>
      <ModalWindow
        isOpen={showCreateAccount}
        onClose={() => setShowCreateAccount(false)}
      >
        <CreateAccount
          desktopMode={false}
          onCreate={() => setShowCreateAccount(false)}
        />
      </ModalWindow>
      <ModalWindow
        isOpen={showImportAccount}
        onClose={() => setShowImportAccount(false)}
      >
        <ImportAccount
          desktopMode={false}
          onImport={() => setShowImportAccount(false)}
        />
      </ModalWindow>
    </>
  )
}

export default Accounts
