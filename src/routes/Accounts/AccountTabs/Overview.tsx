import { FC, useState, useEffect } from 'react'
import {
  Box,
  Button,
  chakra,
  CommonTable,
  Flex,
  Icon,
  NAMED_COLORS,
  useIronToast,
} from '@ironfish/ui-kit'
import { ChevronRightIcon } from '@chakra-ui/icons'
import SendIcon from 'Svgx/send'
import Receive from 'Svgx/receive'
import FeesImage from 'Svgx/FeesImage'
import SearchSortField from 'Components/Search&Sort'
import useTransactions from 'Hooks/transactions/useAcccountTransactions'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'Routes/data'
import SortType from 'Types/SortType'
import { useDataSync } from 'Providers/DataSyncProvider'
import Transaction, { TransactionStatus } from 'Types/Transaction'
import TransactionStatusView from 'Components/TransactionStatusView'
import Account from 'Types/Account'
import { accountGradientByOrder } from 'Utils/accountGradientByOrder'
import { formatOreToTronWithLanguage } from 'Utils/number'
import EmptyOverview from 'Components/EmptyOverview'
import ContactsPreview from 'Components/ContactsPreview'
import SyncWarningMessage from 'Components/SyncWarningMessage'
import differenceBy from 'lodash/differenceBy'
import intersectionBy from 'lodash/intersectionBy'

interface SearchTransactionsProps {
  address: string
}

const SearchTransactions: FC<SearchTransactionsProps> = ({ address }) => {
  const navigate = useNavigate()
  const [$searchTerm, $setSearchTerm] = useState('')
  const [$sortOrder, $setSortOrder] = useState<SortType>(SortType.DESC)
  const {
    data: transactions = undefined,
    loaded,
    actions: { reload },
  } = useTransactions(address, $searchTerm, $sortOrder)
  const [, setTransactionsState] = useState([])
  const toast = useIronToast({
    containerStyle: {
      mb: '1rem',
    },
  })

  useEffect(() => {
    let interval: NodeJS.Timer
    if (loaded) {
      interval = setInterval(reload, 5000)
    }

    return () => interval && clearInterval(interval)
  }, [loaded])

  useEffect(() => {
    setTransactionsState(prevTransactions => {
      if (!transactions) {
        return []
      }

      const formattedTransactions = transactions.map(({ hash, status }) => ({
        hash,
        status,
      }))

      // check only fetched transactions
      let nextTransactions = intersectionBy(
        prevTransactions,
        transactions,
        'hash'
      )

      // if fetched more then was add missing
      if (transactions.length > prevTransactions.length) {
        nextTransactions = nextTransactions.concat(
          differenceBy(formattedTransactions, prevTransactions, 'hash')
        )
      }

      const pendingTransactions = formattedTransactions.filter(
        t =>
          t.status === TransactionStatus.PENDING ||
          t.status === TransactionStatus.UNCONFIRMED ||
          t.status === TransactionStatus.UNKNOWN
      )

      const prevPendingTransactions = nextTransactions.filter(
        t =>
          t.status === TransactionStatus.PENDING ||
          t.status === TransactionStatus.UNCONFIRMED ||
          t.status === TransactionStatus.UNKNOWN
      )

      const txnCount =
        transactions.length > prevTransactions.length
          ? differenceBy(pendingTransactions, prevPendingTransactions, 'hash')
          : differenceBy(prevPendingTransactions, pendingTransactions, 'hash')

      if (txnCount.length) {
        toast({ title: 'Transaction Sent' })
      }
      return transactions.map(({ hash, status }) => ({ hash, status }))
    })
  }, [loaded])

  return loaded && transactions?.length === 0 && !$searchTerm ? null : (
    <>
      <Box>
        <chakra.h3 pb="1rem">Transactions</chakra.h3>
        <SearchSortField
          SearchProps={{
            value: $searchTerm,
            onChange: e => $setSearchTerm(e.target.value),
          }}
          SortSelectProps={{
            onSelectOption: ({ value }) => $setSortOrder(value),
          }}
          sortValue={$sortOrder}
          options={[
            {
              label: 'Newest to oldest',
              value: SortType.DESC,
            },
            {
              label: 'Oldest to newest',
              value: SortType.ASC,
            },
          ]}
        />
      </Box>
      {transactions?.length === 0 ? (
        <EmptyOverview
          header="0 Results"
          description="There aren’t any transactions with details that match your search input. "
        />
      ) : (
        <CommonTable
          textTransform="capitalize"
          data={!!transactions ? transactions : new Array(10).fill(null)}
          onRowClick={(data: Transaction) =>
            navigate(ROUTES.TRANSACTION, {
              state: { accountId: data.accountId, hash: data.hash },
            })
          }
          columns={[
            {
              key: 'transaction-action-column',
              label: <chakra.h6>Action</chakra.h6>,
              render: transaction => (
                <TransactionStatusView
                  status={transaction.status}
                  isSent={transaction.creator}
                />
              ),
            },
            {
              key: 'transaction-amount-column',
              label: <chakra.h6>$IRON</chakra.h6>,
              render: transaction => (
                <chakra.h5>
                  {(transaction.creator ? '' : '+') + transaction.amount}
                </chakra.h5>
              ),
            },
            {
              key: 'transaction-to-column',
              label: <chakra.h6>From/To</chakra.h6>,
              render: (transaction: Transaction) => (
                <ContactsPreview
                  addresses={
                    transaction.creator ? transaction.to : [transaction.from]
                  }
                  notes={transaction.notes}
                />
              ),
            },
            {
              key: 'transaction-date-column',
              label: <chakra.h6>Date</chakra.h6>,
              render: (transaction: Transaction) => (
                <chakra.h5>{transaction.created.toISOString()}</chakra.h5>
              ),
            },
            {
              key: 'transaction-memo-column',
              label: <chakra.h6>Memo</chakra.h6>,
              render: (transaction: Transaction) => (
                <chakra.h5>"{transaction.notes?.at(0)?.memo}"</chakra.h5>
              ),
            },
            {
              key: 'transaction-details-column',
              label: '',
              ItemProps: {
                marginLeft: 'auto',
                width: 'min-content',
              },
              render: () => (
                <Button
                  variant="link"
                  color={NAMED_COLORS.LIGHT_BLUE}
                  rightIcon={<ChevronRightIcon />}
                >
                  <chakra.h5>View Details</chakra.h5>
                </Button>
              ),
            },
          ]}
        />
      )}
    </>
  )
}

interface AccountOverviewProps {
  account: Account
  order: number
}

const AccountOverview: FC<AccountOverviewProps> = ({ account, order = 0 }) => {
  const { data: transactions = undefined, loaded } = useTransactions(
    account?.id
  )

  const navigate = useNavigate()
  const { loaded: synced } = useDataSync()
  return (
    <>
      <SyncWarningMessage mb="2rem" />
      <Flex w="100%" pb="2rem">
        <Box
          layerStyle="card"
          bg={`${accountGradientByOrder(order)} !important`}
          borderRadius="0.25rem"
          w="100%"
          minWidth="18rem"
          mr="1rem"
          ml="0rem"
          mt="0rem"
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Box m="2rem">
              <Box>
                <chakra.h4 color={NAMED_COLORS.DEEP_BLUE}>$IRON</chakra.h4>
              </Box>
              <Box mb="0.5rem">
                <chakra.h2 color={NAMED_COLORS.DEEP_BLUE}>
                  {formatOreToTronWithLanguage(
                    account?.balance.confirmed || BigInt(0)
                  )}
                </chakra.h2>
              </Box>
              <Box>
                <Button
                  variant="primary"
                  borderRadius="4rem"
                  mr="1rem"
                  borderColor="transparent"
                  leftIcon={
                    <Icon height={8}>
                      <SendIcon />
                    </Icon>
                  }
                  onClick={() =>
                    navigate(ROUTES.SEND, {
                      state: { accountId: account?.id },
                    })
                  }
                  isDisabled={!synced}
                  disabled={!synced}
                >
                  <h5>Send</h5>
                </Button>
                <Button
                  variant="primary"
                  borderRadius="4rem"
                  borderColor="transparent"
                  mr="1rem"
                  leftIcon={
                    <Icon height={8}>
                      <Receive />
                    </Icon>
                  }
                  onClick={() =>
                    navigate(ROUTES.RECEIVE, {
                      state: { accountId: account?.id },
                    })
                  }
                  isDisabled={!synced}
                  disabled={!synced}
                >
                  <h5>Receive</h5>
                </Button>
              </Box>
            </Box>
            <Box display={{ base: 'none', md: 'inline-block' }} m="1rem">
              <FeesImage width={180} height={133} />
            </Box>
          </Flex>
        </Box>
        <Box
          layerStyle="card"
          p="2rem"
          borderRadius="0.25rem"
          minWidth="17.5rem"
          mt="0rem"
        >
          <Box>
            <chakra.h4>Pending $IRON</chakra.h4>
          </Box>
          <Box mb="0.5rem">
            <chakra.h2>
              {formatOreToTronWithLanguage(
                account?.balance.unconfirmed || BigInt(0)
              )}
            </chakra.h2>
          </Box>
        </Box>
      </Flex>
      <Box display={account?.id && loaded ? 'block' : 'none'}>
        {transactions?.length === 0 ? (
          <EmptyOverview
            header="You don’t have any transactions"
            description="When your account compiles transactions they will be listed here. To produce a transactions, eitherF send or receive $IRON."
          />
        ) : (
          <SearchTransactions address={account?.id} />
        )}
      </Box>
    </>
  )
}

export default AccountOverview
