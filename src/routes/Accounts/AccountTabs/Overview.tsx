import { FC, useState } from 'react'
import {
  Box,
  Button,
  chakra,
  CommonTable,
  Flex,
  VStack,
  Icon,
  NAMED_COLORS,
  useColorModeValue,
  Link,
} from '@ironfish/ui-kit'
import { Link as RouterLink } from 'react-router-dom'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Send from 'Svgx/send'
import Receive from 'Svgx/receive'
import FeesImage from 'Svgx/FeesImage'
import { truncateHash } from 'Utils/hash'
import SearchSortField from 'Components/Search&Sort'
import useTransactions from 'Hooks/transactions/useAcccountTransactions'
import { useNavigate } from 'react-router-dom'
import EmptyOverviewImage from 'Svgx/EmptyOverviewImage'
import ROUTES from 'Routes/data'
import SortType from 'Types/SortType'
import { useDataSync } from 'Providers/DataSyncProvider'
import Transaction from 'Types/Transaction'
import TransactionStatusView from 'Components/TransactionStatusView'
import Account from 'Types/Account'
import { CurrencyUtils } from '@ironfish/sdk/build/src/utils/currency'
import { accountGradientByOrder } from 'Utils/accountGradientByOrder'

interface AccountOverviewProps {
  account: Account
  order: number
}

const EmptyOverview = () => {
  const $fontColor = useColorModeValue(
    NAMED_COLORS.GREY,
    NAMED_COLORS.PALE_GREY
  )
  return (
    <Flex mt="2rem" justifyContent="center">
      <VStack w="25rem">
        <chakra.h3 mb="1rem">You don’t have any transactions</chakra.h3>
        <chakra.h5 mb="2.5rem !important" textAlign="center" color={$fontColor}>
          When your account compiles transactions they will be listed here. To
          produce a transactions, either{' '}
          <Link
            as={RouterLink}
            to={ROUTES.SEND}
            color={NAMED_COLORS.LIGHT_BLUE}
          >
            send
          </Link>{' '}
          or{' '}
          <Link
            as={RouterLink}
            to={ROUTES.RECEIVE}
            color={NAMED_COLORS.LIGHT_BLUE}
          >
            receive
          </Link>{' '}
          $IRON.
        </chakra.h5>
        <EmptyOverviewImage />
      </VStack>
    </Flex>
  )
}

const AccountOverview: FC<AccountOverviewProps> = ({ account, order = 0 }) => {
  const [$searchTerm, $setSearchTerm] = useState('')
  const [$sortOrder, $setSortOrder] = useState<SortType>(SortType.ASC)
  const [{ data: transactions, loaded }] = useTransactions(
    account?.id,
    $searchTerm,
    $sortOrder
  )

  const navigate = useNavigate()
  const { loaded: synced } = useDataSync()
  return (
    <>
      <Flex w="100%" pb="2rem">
        <Box
          layerStyle="card"
          bg={`${accountGradientByOrder(order)} !important`}
          borderRadius="0.25rem"
          w="100%"
          minWidth="18rem"
          mr="1rem"
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Box m="2rem">
              <Box>
                <chakra.h4 color={NAMED_COLORS.DEEP_BLUE}>$IRON</chakra.h4>
              </Box>
              <Box mb="0.5rem">
                <chakra.h2 color={NAMED_COLORS.DEEP_BLUE}>
                  {CurrencyUtils.encodeIron(
                    account?.balance.confirmed || BigInt(0)
                  )}
                  &nbsp;<chakra.span whiteSpace="nowrap">$IRON</chakra.span>
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
                      <Send fill="currentColor" />
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
                      <Receive fill="currentColor" />
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
        >
          <Box>
            <chakra.h4>Pending $IRON</chakra.h4>
          </Box>
          <Box mb="0.5rem">
            <chakra.h2>
              {CurrencyUtils.encodeIron(account?.balance.pending || BigInt(0))}
              &nbsp;
              <chakra.span whiteSpace="nowrap">$IRON</chakra.span>
            </chakra.h2>
          </Box>
        </Box>
      </Flex>
      <chakra.h3 pb="1rem">Transactions</chakra.h3>
      <SearchSortField
        SearchProps={{
          value: $searchTerm,
          onChange: e => $setSearchTerm(e.target.value.trimStart()),
        }}
        SortSelectProps={{
          onSelectOption: ({ value }) => $setSortOrder(value),
        }}
        options={[
          {
            label: 'Newest to oldest',
            value: SortType.DESC,
          },
          {
            label: 'Oldest to oldest',
            value: SortType.ASC,
          },
        ]}
      />
      {loaded &&
        (transactions?.length === 0 ? (
          <EmptyOverview />
        ) : (
          <CommonTable
            textTransform="capitalize"
            data={loaded ? transactions : new Array(10).fill(null)}
            columns={[
              {
                key: 'transaction-action-column',
                label: <chakra.h6>Action</chakra.h6>,
                render: (transaction: Transaction) => (
                  <TransactionStatusView status={transaction.status} />
                ),
              },
              {
                key: 'transaction-amount-column',
                label: <chakra.h6>$IRON</chakra.h6>,
                render: (transaction: Transaction) => (
                  <chakra.h5>
                    {(transaction.creator ? '' : '+') + transaction.amount}
                  </chakra.h5>
                ),
              },
              {
                key: 'transaction-to-column',
                label: <chakra.h6>To</chakra.h6>,
                render: (transaction: Transaction) =>
                  transaction.to ? (
                    <chakra.h5>{truncateHash(transaction.to, 3)}</chakra.h5>
                  ) : (
                    <chakra.h5 color={NAMED_COLORS.GREY}>n/a</chakra.h5>
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
                  height: '100%',
                  justifyContent: 'flex-end',
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
        ))}
    </>
  )
}

export default AccountOverview
