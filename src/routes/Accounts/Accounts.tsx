import { FC, useState, useMemo } from 'react'
import {
  Box,
  Button,
  Flex,
  chakra,
  NAMED_COLORS,
  useColorModeValue,
  useBreakpointValue,
  ButtonsGroup,
  Skeleton,
} from '@ironfish/ui-kit'
import IconAdd from '@ironfish/ui-kit/dist/svgx/icon-add'
import SearchSortField from 'Components/Search&Sort'
import useAccounts from 'Hooks/accounts/useAccounts'
import AccountPreview from 'Routes/Accounts/AccountPreview'
import ModalWindow from 'Components/ModalWindow'
import ImportAccount from 'Routes/Onboarding/ImportAccount'
import CreateAccount from 'Routes/Onboarding/CreateAccount'
import SortType from 'Types/SortType'
import { CurrencyUtils } from '@ironfish/sdk/build/src/utils/currency'

interface ActionButtonsProps {
  showCreate: (show: boolean) => void
  showImport: (show: boolean) => void
}

const ActionButtons: FC<ActionButtonsProps> = ({ showCreate, showImport }) => {
  const buttons = useMemo(
    () => [
      {
        key: 'accounts-view-create',
        label: (
          <Flex alignItems="center">
            <IconAdd mr="0.5rem" w="1rem" h="1rem" mb="0.125rem" />
            Create Account
          </Flex>
        ),
        onClick: () => showCreate(true),
      },
      {
        key: 'accounts-view-import',
        label: (
          <Flex alignItems="center">
            <IconAdd mr="0.5rem" w="1rem" h="1rem" mb="0.125rem" />
            Import Account
          </Flex>
        ),
        onClick: () => showImport(true),
      },
    ],
    [showCreate, showImport]
  )
  const isGroup = useBreakpointValue({ base: true, sm2: false })
  return isGroup ? (
    <ButtonsGroup menuItems={buttons} />
  ) : (
    <Flex gap="1rem">
      {buttons.map(({ key, label, onClick }) => (
        <Button
          key={key}
          borderRadius="4rem"
          variant="secondary"
          onClick={onClick}
        >
          <chakra.h5 mt="0.125rem">{label}</chakra.h5>
        </Button>
      ))}
    </Flex>
  )
}

const Accounts = () => {
  const [$searchTerm, $setSearchTerm] = useState('')
  const [$sortOrder, $setSortOrder] = useState<SortType>(SortType.DESC)
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
            <Skeleton minW="4rem" isLoaded={loaded}>
              <h5>
                <b>
                  {CurrencyUtils.encodeIron(
                    accounts
                      ?.map(a => a.balance.confirmed || BigInt(0))
                      ?.reduce((a, b) => a + b, BigInt(0)) || BigInt(0)
                  )}
                  &nbsp;$IRON
                </b>
              </h5>
            </Skeleton>
          </Flex>
        </Flex>
        <ActionButtons
          showCreate={setShowCreateAccount}
          showImport={setShowImportAccount}
        />
      </Flex>
      <SearchSortField
        sortValue={$sortOrder}
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
              <AccountPreview key={`${account.name}-${index}`} {...account} />
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
