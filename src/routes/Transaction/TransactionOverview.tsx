import { FC, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Box,
  Flex,
  chakra,
  CopyValueToClipboard,
  NAMED_COLORS,
  useColorModeValue,
  Skeleton,
} from '@ironfish/ui-kit'
import size from 'byte-size'
import { ROUTES } from '..'
import BackButtonLink from 'Components/BackButtonLink'
import useAccount from 'Hooks/accounts/useAccount'
import useTransaction from 'Hooks/transactions/useTransaction'
import { truncateHash } from 'Utils/hash'
import Transaction from 'Types/Transaction'
import BlockInfoDifficultyIcon from 'Svgx/BlockInfoDifficultyIcon'
import DifficultyIcon from 'Svgx/DifficultyIcon'
import SizeIcon from 'Svgx/SizeIcon'
import BlockInfoTimestampIcon from 'Svgx/BlockInfoTimestampIcon'
import InOutPutsIcon from 'Svgx/InOutPutsIcon'
import LargeArrowLeftDown from 'Svgx/LargeArrowLeftDown'
import LargeArrowRightUp from 'Svgx/LargeArrowRightUp'

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
    render: (tx: Transaction) => (
      <CopyValueToClipboard
        label={truncateHash(tx?.to || '', 2, 4)}
        value={tx?.to || ''}
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
        value={tx?.to || ''}
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
        value={tx?.to || ''}
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
    render: (tx: Transaction) => tx?.fee,
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
  const borderColor = useColorModeValue(
    NAMED_COLORS.LIGHT_GREY,
    NAMED_COLORS.LIGHTER_GREY
  )
  const { hash, accountId } = useLocation()?.state
  const [{ data: account, loaded: accountLoaded, error: accountLoadError }] =
    useAccount(accountId)
  const {
    loaded: transactionLoaded,
    data: transaction,
    error: txLoadError,
  } = useTransaction(accountId, hash)

  return (
    <Flex flexDirection="column" pb="0" bg="transparent" w="100%">
      <Box>
        <BackButtonLink
          mb="1rem"
          to={ROUTES.ACCOUNTS}
          label={'Back to all accounts'}
        />
        <Flex alignItems="end" mb="4rem">
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
      <Box mb="3rem">
        <chakra.h3 mb="2rem">Transaction Information</chakra.h3>
        <Flex w="100%" wrap="wrap">
          {CARDS.map((card: Card) => (
            <Skeleton isLoaded={transactionLoaded} mr="1rem" mb="1rem">
              <Box
                layerStyle="card"
                h="7.5rem"
                minW="19rem"
                mr="1rem"
                mb="1rem"
              >
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
        </Flex>
      </Box>
      <Box>
        <chakra.h3 mb="2rem">Inputs / Outputs</chakra.h3>
      </Box>
      <Flex w="100%">
        <Box w="calc(50% - 1.5rem)" mr="1rem">
          <Box m="1rem">
            <chakra.h5 color={color}>INPUTS</chakra.h5>
          </Box>
          {transaction?.spends?.map(spend => (
            <Flex
              border="1px solid"
              borderColor={borderColor}
              borderRadius="0.25rem"
              h="5rem"
              w="100%"
              p="1rem"
              mr="1rem"
              mb="1rem"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box mr="1rem">
                <LargeArrowLeftDown />
              </Box>
              <Box
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
              >
                {spend.nullifier}
              </Box>
            </Flex>
          ))}
        </Box>
        <Box w="calc(50% - 1.5rem)">
          <Box m="1rem">
            <chakra.h5 color={color}>OUTPUTS</chakra.h5>
          </Box>
          {transaction?.notes?.map(note => (
            <Flex
              mr="1rem"
              mb="1rem"
              h="5rem"
              p="1rem"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="0.25rem"
              alignItems="center"
            >
              <Box mr="1rem">
                <LargeArrowRightUp />
              </Box>
              <Flex justifyContent="space-between" alignItems="center" w="100%">
                <Box>{note.memo}</Box>
                <Box>{note.value.toString()} $IRON</Box>
              </Flex>
            </Flex>
          ))}
        </Box>
      </Flex>
    </Flex>
  )
}

export default TransactionOverview
