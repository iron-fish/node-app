import { FC, ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Box,
  Flex,
  chakra,
  CopyValueToClipboard,
  NAMED_COLORS,
  useColorModeValue,
  Skeleton,
  Grid,
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
import SimpleTable from 'Components/SimpleTable'
import ContactsPreview from 'Components/ContactsPreview'

interface Card {
  render: (tx: Transaction) => ReactNode
  label: string
  icon: FC
}
const CARDS: Card[] = [
  {
    render: (tx: Transaction) => tx?.amount,
    label: '$IRON Sent',
    icon: DifficultyIcon,
  },
  {
    render: (tx: Transaction) =>
      tx?.to?.length > 1
        ? tx?.to?.length + ' Addresses'
        : tx?.to?.length === 1 && (
            <CopyValueToClipboard
              label={truncateHash(tx.to[0] || '', 2, 4)}
              value={tx.to[0] || ''}
              iconButtonProps={{
                color: NAMED_COLORS.GREY,
              }}
              copyTooltipText={'Copy address to'}
              copiedTooltipText={'Address copied'}
            />
          ),
    label: 'To',
    icon: DifficultyIcon,
  },
  {
    render: (tx: Transaction) => tx?.notes?.at(0)?.memo || <>&nbsp;</>,
    label: 'Memo',
    icon: SizeIcon,
  },
  {
    render: (tx: Transaction) => (
      <CopyValueToClipboard
        label={truncateHash(tx?.blockHash || '', 2, 4)}
        value={tx?.blockHash || ''}
        iconButtonProps={{
          color: NAMED_COLORS.GREY,
        }}
        copyTooltipText={'Copy block hash'}
        copiedTooltipText={'Block hash copied'}
      />
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
    render: (tx: Transaction) => tx?.created.toLocaleString(),
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
  const color = useColorModeValue(NAMED_COLORS.GREY, NAMED_COLORS.PALE_GREY)
  const { hash, accountId, contactId } = useLocation()?.state
  const [{ data: account, loaded: accountLoaded }] = useAccount(accountId)
  const {
    loaded: transactionLoaded,
    data: transaction,
    actions: { reload },
  } = useTransaction(accountId, hash)

  useEffect(() => {
    let interval: NodeJS.Timer
    if (
      transactionLoaded &&
      (transaction.status === TransactionStatus.PENDING ||
        transaction.status === TransactionStatus.UNCONFIRMED ||
        TransactionStatus.UNKNOWN)
    ) {
      interval = setInterval(reload, 1000)
    }

    return () => interval && clearInterval(interval)
  })

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
              label={
                <chakra.h5>{truncateHash(account?.publicAddress, 3)}</chakra.h5>
              }
              value={account?.publicAddress}
              copyTooltipText="Copy to clipboard"
              copiedTooltipText="Copied"
              containerProps={{
                pb: '0.45rem',
                color: color,
              }}
            />
          </Skeleton>
        </Flex>
      </Box>
      <Box mb="2.5rem">
        <chakra.h3 mb="1rem">Transaction Information</chakra.h3>
        <Grid
          w="100%"
          templateColumns="repeat(auto-fit, minmax(19rem, 1fr))"
          autoRows="7.75rem"
          gap="1rem"
        >
          {CARDS.map((card: Card) => (
            <Skeleton isLoaded={!!transaction} minW="19rem" h="7.5rem">
              <Box layerStyle="card" h="7.5rem" minW="19rem">
                <Flex
                  w="100%"
                  h="100%"
                  p="2rem"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box mr="1rem">
                    <Box>
                      <chakra.h4 color={color}>{card.label}</chakra.h4>
                    </Box>
                    <Box overflow="hidden" whiteSpace="nowrap">
                      {card.render(transaction)}
                    </Box>
                  </Box>
                  <Box>
                    <card.icon />
                  </Box>
                </Flex>
              </Box>
            </Skeleton>
          ))}
        </Grid>
      </Box>
      <Box>
        <chakra.h3 mb="1rem">Inputs / Outputs</chakra.h3>
      </Box>
      <Flex w="100%" justifyContent="space-between">
        <Box w="calc(50% - 1.5rem)" mr="1rem">
          <SimpleTable
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
                      <chakra.h5>
                        <CopyValueToClipboard
                          copiedTooltipText="Input address copied"
                          copyTooltipText="Copy Input address"
                          label={truncateHash(spend.nullifier, 2, 4)}
                          value={spend.nullifier}
                          iconButtonProps={{
                            color: NAMED_COLORS.GREY,
                          }}
                        />
                      </chakra.h5>
                    </Box>
                  </Flex>
                ),
              },
            ]}
          />
        </Box>
        <Box w="calc(50% - 1.5rem)">
          <SimpleTable
            data={transaction?.notes || []}
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
                label: '$IRON',
                render: (note: Note) => (
                  <chakra.h5>
                    {formatOreToTronWithLanguage(note?.value || BigInt(0))}
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
