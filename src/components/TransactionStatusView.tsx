import { FC, ReactNode } from 'react'
import { Flex, NAMED_COLORS, useColorModeValue, chakra } from '@ironfish/ui-kit'
import { TransactionStatus } from 'Types/Transaction'
import PendingIcon from '@ironfish/ui-kit/dist/svgx/pending-icon'
import ExpiredIcon from '@ironfish/ui-kit/dist/svgx/expired-icon'
import SendIcon from 'Svgx/send'
import ReceiveIcon from 'Svgx/receive'

interface TransactionStatusProps {
  status: TransactionStatus
  creator?: boolean
}

const ActionIconWrapper: FC<{
  color: string
  children?: ReactNode
}> = ({ color, children }) => (
  <Flex
    w="1.625rem"
    h="1.625rem"
    borderRadius="50%"
    alignItems="center"
    justifyContent="center"
    backgroundColor={color}
  >
    {children}
  </Flex>
)

const SendActionIcon: FC = () => {
  const bg = useColorModeValue('#FFE4DC', '#341E17')
  return (
    <ActionIconWrapper color={bg}>
      <SendIcon height="0.875rem" width="0.875rem" color="#F15929" />
    </ActionIconWrapper>
  )
}

const ReceiveActionIcon: FC = () => {
  const colors = useColorModeValue(
    {
      color: '#335A48',
      bg: '#EBFBF4',
    },
    {
      color: '#5FC89A',
      bg: '#192D23',
    }
  )

  return (
    <ActionIconWrapper color={colors.bg}>
      <ReceiveIcon height="0.875rem" width="0.875rem" color={colors.color} />
    </ActionIconWrapper>
  )
}

const ExpiredActionIcon: FC = () => {
  const colors = useColorModeValue(
    {
      color: NAMED_COLORS.GREY,
      bg: NAMED_COLORS.LIGHTER_GREY,
    },
    {
      color: '#FFFFFF',
      bg: NAMED_COLORS.DARK_GREY,
    }
  )

  return (
    <ActionIconWrapper color={colors.bg}>
      <ExpiredIcon height="0.75rem" width="0.75rem" color={colors.color} />
    </ActionIconWrapper>
  )
}

const PendingActionIcon: FC = () => {
  const colors = useColorModeValue(
    {
      color: '#7C7322',
      bg: '#FEF8C3',
    },
    {
      color: '#E7D95C',
      bg: '#403B10',
    }
  )

  return (
    <ActionIconWrapper color={colors.bg}>
      <PendingIcon h="0.75rem" w="0.75rem" color={colors.color} />
    </ActionIconWrapper>
  )
}

const getStatusIcon = (status: TransactionStatus, creator = false) => {
  switch (status) {
    case TransactionStatus.CONFIRMED:
      return creator ? <SendActionIcon /> : <ReceiveActionIcon />
    case TransactionStatus.EXPIRED:
      return <ExpiredActionIcon />
    case TransactionStatus.PENDING:
    case TransactionStatus.UNCONFIRMED:
    case TransactionStatus.UNKNOWN:
      return <PendingActionIcon />
    default:
      break
  }
}

const getStatusMessage = (status: TransactionStatus, creator: boolean) => {
  switch (status) {
    case TransactionStatus.CONFIRMED:
      return creator ? 'Sent' : 'Received'
    case TransactionStatus.EXPIRED:
      return 'Expired'
    case TransactionStatus.PENDING:
    case TransactionStatus.UNCONFIRMED:
    case TransactionStatus.UNKNOWN:
      return 'Pending'
    default:
      break
  }
}

const TransactionStatusView: FC<TransactionStatusProps> = ({
  status,
  creator,
}) => (
  <Flex alignItems="center" gap="0.75rem" w="6.25rem">
    {getStatusIcon(status, creator)}
    <chakra.h5>{getStatusMessage(status, creator)}</chakra.h5>
  </Flex>
)

export default TransactionStatusView
