import { FC, useState, useMemo, useEffect } from 'react'
import {
  Box,
  Button,
  Flex,
  chakra,
  NAMED_COLORS,
  useBreakpointValue,
  ButtonsGroup,
  Skeleton,
  IconAdd,
} from '@ironfish/ui-kit'
import SearchSortField from 'Components/Search&Sort'
import useAccounts from 'Hooks/accounts/useAccounts'
import AccountPreview from 'Routes/Accounts/AccountPreview'
import ModalWindow from 'Components/ModalWindow'
import ImportAccount from 'Routes/Onboarding/ImportAccount'
import CreateAccount from 'Routes/Onboarding/CreateAccount'
import SortType from 'Types/SortType'
import { formatOreToTronWithLanguage } from 'Utils/number'
import EmptyOverview from 'Components/EmptyOverview'
import SyncWarningMessage from 'Components/SyncWarningMessage'

interface ActionButtonsProps {
  reloadAccounts: () => void
}

const ActionButtons: FC<ActionButtonsProps> = ({ reloadAccounts }) => {
  const [showCreateAccount, setShowCreateAccount] = useState(false)
  const [showImportAccount, setShowImportAccount] = useState(false)

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
        onClick: () => setShowCreateAccount(true),
      },
      {
        key: 'accounts-view-import',
        label: (
          <Flex alignItems="center">
            <IconAdd mr="0.5rem" w="1rem" h="1rem" mb="0.125rem" />
            Import Account
          </Flex>
        ),
        onClick: () => setShowImportAccount(true),
      },
    ],
    [setShowCreateAccount, setShowImportAccount]
  )
  const isGroup = useBreakpointValue({ base: true, sm4: false })
  return (
    <>
      {isGroup ? (
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
      )}
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

const Accounts = () => {
  const [$searchTerm, $setSearchTerm] = useState('')
  const [$sortOrder, $setSortOrder] = useState<SortType>(SortType.DESC)
  const [{ data: accounts, loaded }, reloadAccounts] = useAccounts(
    $searchTerm,
    $sortOrder
  )

  useEffect(() => {
    let timeout: NodeJS.Timer
    if (loaded) {
      timeout = setInterval(reloadAccounts, 5000)
    }

    return () => timeout && clearInterval(timeout)
  }, [loaded])

  const isAccountsLoaded = accounts && accounts.length > 0

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
            <chakra.h5
              color={NAMED_COLORS.GREY}
              _dark={{ color: NAMED_COLORS.PALE_GREY }}
            >
              Total accounts balance:
            </chakra.h5>
            &nbsp;
            <Skeleton minW="4rem" isLoaded={isAccountsLoaded}>
              <h5>
                <b>
                  {formatOreToTronWithLanguage(
                    accounts
                      ?.map(a => a.balances?.default?.confirmed || BigInt(0))
                      ?.reduce((a, b) => a + b, BigInt(0)) || BigInt(0)
                  )}
                  &nbsp;$IRON
                </b>
              </h5>
            </Skeleton>
          </Flex>
        </Flex>
        <ActionButtons reloadAccounts={reloadAccounts} />
      </Flex>
      <SearchSortField
        sortValue={$sortOrder}
        SearchProps={{
          value: $searchTerm,
          onChange: e => {
            $setSearchTerm(e.target.value.trimStart())
          },
        }}
        SortSelectProps={{
          onSelectOption: ({ value }) => $setSortOrder(value),
        }}
      />
      <SyncWarningMessage mt="2rem" />
      <Flex mt="0.5rem" direction="column" width="100%">
        {isAccountsLoaded ? (
          accounts.length > 0 ? (
            accounts.map((account, index) => (
              <AccountPreview key={`${account.name}-${index}`} {...account} />
            ))
          ) : (
            <EmptyOverview
              header="0 Results"
              description="There aren’t any accounts with details that match your search input."
            />
          )
        ) : null}
      </Flex>
    </>
  )
}

export default Accounts
