import { FC } from 'react'
import { Flex, NAMED_COLORS, useColorModeValue, chakra } from '@ironfish/ui-kit'
import { TransactionStatus } from 'Types/Transaction'
import PendingIcon from '@ironfish/ui-kit/dist/svgx/pending-icon'
import ConfirmedIcon from '@ironfish/ui-kit/dist/svgx/confirmed-icon'
import ExpiredIcon from '@ironfish/ui-kit/dist/svgx/expired-icon'
import AwaitIcon from '@ironfish/ui-kit/dist/svgx/await-icon'

interface TransactionStatusProps {
  status: TransactionStatus
}

const getStatusIcon = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.CONFIRMED:
      return <ConfirmedIcon />
    case TransactionStatus.PENDING:
      return <PendingIcon />
    case TransactionStatus.EXPIRED:
      return <ExpiredIcon color={'#F15929'} />
    case TransactionStatus.UNCONFIRMED:
      return <AwaitIcon />
    case TransactionStatus.UNKNOWN:
      return (
        <chakra.h4 mt="0.0625rem" ml="0.0625rem">
          ?
        </chakra.h4>
      )
    default:
      break
  }
}

const getStatusMessage = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.CONFIRMED:
      return 'Confirmed'
    case TransactionStatus.PENDING:
      return 'Pending'
    case TransactionStatus.EXPIRED:
      return 'Expired'
    case TransactionStatus.UNCONFIRMED:
      return 'Awaiting confirmation'
    case TransactionStatus.UNKNOWN:
      return 'Unknown'
    default:
      break
  }
}

const TransactionStatus: FC<TransactionStatusProps> = ({ status }) => {
  const bgColor = useColorModeValue(
    NAMED_COLORS.LIGHT_GREY,
    NAMED_COLORS.DARK_GREY
  )
  return (
    <Flex alignItems="center" gap="0.75rem">
      <Flex
        w="1.625rem"
        h="1.625rem"
        borderRadius="50%"
        alignItems="center"
        justifyContent="center"
        backgroundColor={
          status === TransactionStatus.EXPIRED ? '#FFE2D9' : bgColor
        }
      >
        {getStatusIcon(status)}
      </Flex>
      <chakra.h5>{getStatusMessage(status)}</chakra.h5>
    </Flex>
  )
}

export default TransactionStatusView
