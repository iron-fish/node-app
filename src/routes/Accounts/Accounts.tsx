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
import useAccounts from 'Hooks/accounts/useAccounts'
import AccountPreview from 'Routes/Accounts/AccountPreview'
import ModalWindow from 'Components/ModalWindow'
import ImportAccount from 'Routes/Onboarding/ImportAccount'
import CreateAccount from 'Routes/Onboarding/CreateAccount'
import SortType from 'Types/SortType'

const Accounts = () => {
  const [$searchTerm, $setSearchTerm] = useState('')
  const [$sortOrder, $setSortOrder] = useState<SortType>(SortType.ASC)
  const [{ data: accounts, loaded }, reloadAccounts] = useAccounts(
    $searchTerm,
    $sortOrder
  )
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
      <SearchSortField
        SearchProps={{
          onChange: e => $setSearchTerm(e.target.value),
        }}
        SortSelectProps={{
          onSelectOption: ({ value }) => $setSortOrder(value),
        }}
      />
      <Flex mt="0.5rem" direction="column" width="100%">
        {loaded
          ? accounts.map((account, index) => (
              <AccountPreview
                key={`${account.name}-${index}`}
                {...account}
                order={index}
              />
            ))
          : null}
      </Flex>
      <ModalWindow
        isOpen={showCreateAccount}
        onClose={() => setShowCreateAccount(false)}
      >
        <CreateAccount
          desktopMode={false}
          onCreate={() => {
            setShowCreateAccount(false)
            reloadAccounts()
          }}
        />
      </ModalWindow>
      <ModalWindow
        isOpen={showImportAccount}
        onClose={() => setShowImportAccount(false)}
      >
        <ImportAccount
          desktopMode={false}
          onImport={() => {
            setShowImportAccount(false)
            reloadAccounts()
          }}
        />
      </ModalWindow>
    </>
  )
}

export default Accounts
