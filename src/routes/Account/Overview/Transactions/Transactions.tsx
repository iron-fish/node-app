import React from 'react'
import {
  chakra,
  Grid,
  GridItem,
  Box,
  GridItemProps,
  useColorMode,
  NAMED_COLORS,
  HStack,
  Spinner,
} from '@ironfish/ui-kit'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'Routes/data'
import Transaction from 'Types/Transaction'
import TransactionStatusView from 'Components/TransactionStatusView'
import EmptyOverview from 'Components/EmptyOverview'
import ContactsPreview from 'Components/ContactsPreview'
import AssetsAmountPreview from 'Components/AssetsAmountPreview'
import { formatDate } from 'Utils/formatDate'
import { Container } from 'Routes/Account/Shared/Container'

export const TRANSACTION_TITLE_HEIGHT = 60

export function TransactionTitle({ style }: { style: React.CSSProperties }) {
  return (
    <Box sx={style}>
      <Container>
        <chakra.h3>Transactions</chakra.h3>
      </Container>
    </Box>
  )
}

export const TRANSACTIONS_HEADINGS_HEIGHT = 35

export function TransactionsHeadings({
  style,
}: {
  style: React.CSSProperties
}) {
  return (
    <Box sx={style}>
      <Container>
        <Grid
          templateColumns={`repeat(5, 1fr)`}
          height={`${TRANSACTIONS_HEADINGS_HEIGHT}px`}
          opacity="0.8"
        >
          <GridItem pl="1rem">
            <chakra.h6>Action</chakra.h6>
          </GridItem>
          <GridItem>
            <chakra.h6>Amount</chakra.h6>
          </GridItem>
          <GridItem>
            <chakra.h6>From/To</chakra.h6>
          </GridItem>
          <GridItem>
            <chakra.h6>Date</chakra.h6>
          </GridItem>
          <GridItem>
            <chakra.h6>Memo</chakra.h6>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}

const ROW_BODY_HEIGHT = 86
const ROW_MARGIN_BOTTOM = 16
export const ROW_SIZE = ROW_BODY_HEIGHT + ROW_MARGIN_BOTTOM

const px = (n: number) => `${n}px`

function Cell(props: GridItemProps) {
  return <GridItem display="flex" px="0.5rem" alignItems="center" {...props} />
}

export function TransactionRow({
  style,
  transaction,
}: {
  style: React.CSSProperties
  transaction?: Transaction
}) {
  const navigate = useNavigate()
  const isLightMode = useColorMode().colorMode === 'light'

  if (!transaction) return null

  return (
    <Box sx={style} pb="0.25rem">
      <Container
        role="link"
        data-href={ROUTES.TRANSACTION}
        cursor="pointer"
        onClick={() => {
          navigate(ROUTES.TRANSACTION, {
            state: {
              accountId: transaction.accountId,
              hash: transaction.hash,
            },
          })
        }}
      >
        <Grid
          templateColumns={`repeat(5, 1fr)`}
          height={px(ROW_BODY_HEIGHT)}
          bg={isLightMode ? NAMED_COLORS.WHITE : NAMED_COLORS.DARKER_GREY}
          borderRadius="0.5rem"
          border={`1px solid ${
            isLightMode ? NAMED_COLORS.LIGHT_GREY : NAMED_COLORS.DARK_GREY
          }`}
        >
          <Cell pl="1rem">
            <TransactionStatusView transaction={transaction} />
          </Cell>
          <Cell>
            <AssetsAmountPreview
              assetAmounts={
                transaction?.assetAmounts.length
                  ? transaction?.assetAmounts
                  : transaction?.amount
                  ? [transaction?.amount]
                  : []
              }
            />
          </Cell>
          <Cell>
            <ContactsPreview
              addresses={
                transaction.creator
                  ? transaction.to
                  : transaction.from
                  ? [transaction.from]
                  : []
              }
              notes={transaction.outputs}
            />
          </Cell>
          <Cell>
            <chakra.h5>{formatDate(transaction.created)}</chakra.h5>
          </Cell>
          <Cell pr="1rem">
            <chakra.h5>
              {transaction.outputs?.at(0)?.memo ||
                transaction.inputs?.at(0)?.memo}
            </chakra.h5>
          </Cell>
        </Grid>
      </Container>
    </Box>
  )
}

export function Loader({ style }: { style: React.CSSProperties }) {
  return (
    <HStack
      justifyContent="center"
      height={px(ROW_BODY_HEIGHT)}
      alignItems="center"
      sx={style}
    >
      <Spinner />
    </HStack>
  )
}

export function EmptyState({ style }: { style: React.CSSProperties }) {
  return (
    <Box sx={style}>
      <Container>
        <EmptyOverview
          header="You don't have any transactions"
          description="When your account compiles transactions they will be listed here. To produce a transactions, eitherF send or receive $IRON."
        />
      </Container>
    </Box>
  )
}
