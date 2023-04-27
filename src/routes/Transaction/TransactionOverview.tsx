import { FC, ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Box,
  Flex,
  chakra,
  CopyValueToClipboard,
  NAMED_COLORS,
  Skeleton,
  Grid,
  useIronToast,
} from '@ironfish/ui-kit'
import size from 'byte-size'
import { ROUTES } from '..'
import BackButtonLink from 'Components/BackButtonLink'
import useAccount from 'Hooks/accounts/useAccount'
import useTransaction from 'Hooks/transactions/useTransaction'
import { truncateHash } from 'Utils/hash'
import { formatOreToTronWithLanguage } from 'Utils/number'
import Transaction, { Note, Spend, TransactionStatus } from 'Types/Transaction'
import BlockInfoDifficultyIcon from 'Svgx/BlockInfoDifficultyIcon'
import DifficultyIcon from 'Svgx/DifficultyIcon'
import SizeIcon from 'Svgx/SizeIcon'
import BlockInfoTimestampIcon from 'Svgx/BlockInfoTimestampIcon'
import InOutPutsIcon from 'Svgx/InOutPutsIcon'
import LargeArrowLeftDown from 'Svgx/LargeArrowLeftDown'
import LargeArrowRightUp from 'Svgx/LargeArrowRightUp'
import ContactsPreview from 'Components/ContactsPreview'
import WalletCommonTable from 'Components/WalletCommonTable'
import InfoBadge from 'Components/InfoBadge'
import AssetsAmountPreview from 'Components/AssetsAmountPreview'
import { formatDate } from 'Utils/formatDate'
import { Card } from '@ironfish/ui-kit'
import { CardBody } from '@ironfish/ui-kit'

interface Card {
  render: (tx: Transaction) => ReactNode
  label: string
  icon: FC
}
const CARDS: Card[] = [
  {
    render: (tx: Transaction) => (
      <AssetsAmountPreview
        assetAmounts={
          tx?.assetAmounts.length
            ? tx?.assetAmounts
            : tx?.amount
            ? [tx?.amount]
            : []
        }
        amountPreviewTextProps={{
          as: 'h4',
        }}
      />
    ),
    label: 'Asset',
    icon: DifficultyIcon,
  },
  {
    render: (tx: Transaction) =>
      tx?.to?.length > 1
        ? tx?.to?.length + ' Addresses'
        : (tx?.to?.length === 1 && (
            <CopyValueToClipboard
              label={truncateHash(tx.to[0] || '', 2, 4)}
              value={tx.to[0] || ''}
              iconButtonProps={{
                color: NAMED_COLORS.GREY,
              }}
              copyTooltipText={'Copy address'}
              copiedTooltipText={'Address copied'}
            />
          )) ||
          'n / a',
    label: 'To',
    icon: DifficultyIcon,
  },
  {
    render: (tx: Transaction) => tx?.outputs?.at(0)?.memo || <>&nbsp;</>,
    label: 'Memo',
    icon: SizeIcon,
  },
  {
    render: (tx: Transaction) =>
      tx?.blockHash ? (
        <CopyValueToClipboard
          label={truncateHash(tx?.blockHash || '', 2, 4)}
          value={tx?.blockHash || ''}
          iconButtonProps={{
            color: NAMED_COLORS.GREY,
          }}
          copyTooltipText={'Copy block hash'}
          copiedTooltipText={'Block hash copied'}
        />
      ) : (
        'n/a'
      ),
    label: 'Block Hash',
    icon: DifficultyIcon,
  },
  {
    render: (tx: Transaction) => (
      <CopyValueToClipboard
        label={truncateHash(tx?.hash || '', 2, 4)}
        iconButtonProps={{
          color: NAMED_COLORS.GREY,
        }}
        value={tx?.hash || ''}
        copyTooltipText={'Copy Transaction hash'}
        copiedTooltipText={'Transaction hash copied'}
      />
    ),
    label: 'Transaction Hash',
    icon: DifficultyIcon,
  },
  {
    render: (tx: Transaction) => size(tx?.size || 0).toString(),
    label: 'Size',
    icon: SizeIcon,
  },
  {
    render: (tx: Transaction) =>
      formatOreToTronWithLanguage(BigInt(tx?.fee || 0)) + ' $IRON',
    label: 'Fee',
    icon: BlockInfoDifficultyIcon,
  },
  {
    render: (tx: Transaction) => formatDate(tx?.created),
    label: 'Timestamp',
    icon: BlockInfoTimestampIcon,
  },
  {
    render: (tx: Transaction) => tx?.spendsCount + ' / ' + tx?.notesCount,
    label: 'Inputs / Outputs',
    icon: InOutPutsIcon,
  },
]

const TransactionOverview: FC = () => {
  const { hash, accountId, contactId } = useLocation()?.state
  const [{ data: account, loaded: accountLoaded }] = useAccount(accountId)
  const {
    loaded: transactionLoaded,
    data: transaction,
    actions: { reload },
  } = useTransaction(accountId, hash)
  const [, setTransactionState] = useState<TransactionStatus | undefined>()
  const toast = useIronToast({
    containerStyle: {
      mb: '1rem',
    },
  })

  useEffect(() => {
    let interval: NodeJS.Timer
    if (
      transactionLoaded &&
      (transaction.status === TransactionStatus.PENDING ||
        transaction.status === TransactionStatus.UNCONFIRMED ||
        transaction.status === TransactionStatus.UNKNOWN)
    ) {
      interval = setInterval(reload, 5000)
    }

    return () => interval && clearInterval(interval)
  }, [transactionLoaded])

  useEffect(() => {
    setTransactionState(prev => {
      if (
        !prev &&
        transaction?.status !== TransactionStatus.CONFIRMED &&
        transaction?.status !== TransactionStatus.EXPIRED
      ) {
        return transaction?.status
      }
      if (prev && transaction?.status === TransactionStatus.CONFIRMED) {
        toast({ title: 'Transaction Sent' })
        return undefined
      }
      if (prev && transaction?.status === TransactionStatus.EXPIRED) {
        toast({ title: 'Transaction Expired' })
        return undefined
      }
    })
  }, [transactionLoaded])

  return (
    <Flex flexDirection="column" pb="0" bg="transparent" w="100%">
      <Box>
        <BackButtonLink
          mb="1rem"
          to={
            contactId ? ROUTES.ADDRESS_BOOK + `/${contactId}` : ROUTES.ACCOUNT
          }
          state={{ accountId: accountId }}
          label={
            contactId ? 'Back to Contact Overview' : 'Back to Account Overview'
          }
        />
        <Flex alignItems="end" mb="2.5rem">
          <Skeleton isLoaded={accountLoaded} minW="8rem" h="1.75rem" mr="1rem">
            <chakra.h2 mr="1rem">{account?.name}</chakra.h2>
          </Skeleton>
          <Skeleton isLoaded={accountLoaded} minW="8rem" h="0.875rem">
            <CopyValueToClipboard
              label={truncateHash(account?.publicAddress, 3)}
              value={account?.publicAddress}
              copyTooltipText="Copy to clipboard"
              copiedTooltipText="Copied"
              labelProps={{
                as: 'h5',
              }}
              containerProps={{
                pb: '0.45rem',
                color: NAMED_COLORS.GREY,
                _dark: {
                  color: NAMED_COLORS.PALE_GREY,
                },
              }}
            />
          </Skeleton>
        </Flex>
      </Box>
      <Box mb="2.5rem">
        <Flex mb="1rem">
          <chakra.h3 alignSelf="center">Transaction Information</chakra.h3>
          {(transaction?.status === TransactionStatus.PENDING ||
            transaction?.status === TransactionStatus.UNCONFIRMED ||
            transaction?.status === TransactionStatus.UNKNOWN) && (
            <InfoBadge message="Pending" alignSelf="baseline" ml="1rem" />
          )}
        </Flex>
        <Grid
          w="100%"
          templateColumns="repeat(auto-fit, minmax(19rem, 1fr))"
          autoRows="7.75rem"
          gap="1rem"
        >
          {CARDS.map((card: Card, index) => (
            <Skeleton
              key={`${card.label}-${index}`}
              isLoaded={!!transaction}
              minW="19rem"
              h="7.5rem"
            >
              <Card variant="ironFish" h="7.5rem" minW="19rem">
                <CardBody>
                  <Flex
                    w="100%"
                    p="2rem"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box mr="1rem">
                      <Box>
                        <chakra.h4
                          color={NAMED_COLORS.GREY}
                          _dark={{
                            color: NAMED_COLORS.PALE_GREY,
                          }}
                        >
                          {card.label}
                        </chakra.h4>
                      </Box>
                      <Box overflow="hidden" whiteSpace="nowrap">
                        {card.render(transaction)}
                      </Box>
                    </Box>
                    <Box>
                      <card.icon />
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            </Skeleton>
          ))}
        </Grid>
      </Box>
      <Box>
        <chakra.h3 mb="1rem">Inputs / Outputs</chakra.h3>
      </Box>
      <Flex
        w="100%"
        justifyContent="space-between"
        flexDirection={{ base: 'column', md: 'row' }}
        gap={{ base: 0, md: '1rem' }}
      >
        <Box
          w={{ base: '100%', md: '50%' }}
          mb={{
            base: transaction?.creator
              ? transaction?.inputs?.length
                ? '-2rem'
                : 0
              : transaction?.spends?.length
              ? '-2rem'
              : 0,
            md: 0,
          }}
        >
          {transaction?.creator ? (
            <WalletCommonTable
              data={transaction?.inputs || []}
              w="100%"
              columns={[
                {
                  key: 'input-address',
                  label: 'INPUT ADDRESS',
                  render: (note: Note) => (
                    <Flex alignItems="center">
                      <Box mr="1rem">
                        <LargeArrowRightUp h="1.125rem" w="1.125rem" />
                      </Box>
                      <chakra.h5>
                        <ContactsPreview addresses={[transaction?.from]} />
                      </chakra.h5>
                    </Flex>
                  ),
                },
                {
                  key: 'note-amount',
                  label: 'Amount',
                  render: (note: Note) => (
                    <chakra.h5>
                      {formatOreToTronWithLanguage(note?.value || BigInt(0)) +
                        ' ' +
                        note?.asset.name}
                    </chakra.h5>
                  ),
                },
              ]}
            />
          ) : (
            <WalletCommonTable
              data={transaction?.spends || []}
              w="100%"
              columns={[
                {
                  key: 'input-address',
                  label: 'INPUT ADDRESS',
                  render: (spend: Spend) => (
                    <Flex alignItems="center">
                      <Box mr="1rem">
                        <LargeArrowLeftDown h="1.125rem" w="1.125rem" />
                      </Box>
                      <Box
                        overflow="hidden"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                      >
                        <CopyValueToClipboard
                          copiedTooltipText="Input address copied"
                          copyTooltipText="Copy Input address"
                          label={truncateHash(spend.nullifier, 2, 4)}
                          value={spend.nullifier}
                          iconButtonProps={{
                            color: NAMED_COLORS.GREY,
                          }}
                          labelProps={{
                            as: 'h5',
                          }}
                        />
                      </Box>
                    </Flex>
                  ),
                },
              ]}
            />
          )}
        </Box>
        <Box w={{ base: '100%', md: '50%' }}>
          <WalletCommonTable
            data={transaction?.outputs || []}
            w="100%"
            columns={[
              {
                key: 'output-address',
                label: 'OUTPUT ADDRESS',
                render: (note: Note) => (
                  <Flex alignItems="center">
                    <Box mr="1rem">
                      <LargeArrowRightUp h="1.125rem" w="1.125rem" />
                    </Box>
                    <chakra.h5>
                      <ContactsPreview addresses={[note?.sender]} />
                    </chakra.h5>
                  </Flex>
                ),
              },
              {
                key: 'note-amount',
                label: 'Amount',
                render: (note: Note) => (
                  <chakra.h5>
                    {formatOreToTronWithLanguage(note?.value || BigInt(0)) +
                      ' ' +
                      note?.asset.name}
                  </chakra.h5>
                ),
              },
              {
                key: 'note-memo',
                label: 'Memo',
                ItemProps: {
                  paddingLeft: '1rem',
                },
                render: (note: Note) => <chakra.h5>{note?.memo}</chakra.h5>,
              },
            ]}
          />
        </Box>
      </Flex>
    </Flex>
  )
}

export default TransactionOverview
