import { FC } from 'react'
import { Flex, NAMED_COLORS, useColorModeValue, chakra } from '@ironfish/ui-kit'
import TransactionStatusType from 'Types/TransactionStatusType'
import PendingIcon from '@ironfish/ui-kit/dist/svgx/pending-icon'
import ConfirmedIcon from '@ironfish/ui-kit/dist/svgx/confirmed-icon'
import ExpiredIcon from '@ironfish/ui-kit/dist/svgx/expired-icon'
import AwaitIcon from '@ironfish/ui-kit/dist/svgx/await-icon'

interface TransactionStatusProps {
  status: TransactionStatusType
}

const getStatusIcon = (status: TransactionStatusType) => {
  switch (status) {
    case TransactionStatusType.CONFIRMED:
      return <ConfirmedIcon />
    case TransactionStatusType.PENDING:
      return <PendingIcon />
    case TransactionStatusType.EXPIRED:
      return <ExpiredIcon color={'#F15929'} />
    case TransactionStatusType.UNCONFIRMED:
      return <AwaitIcon />
    case TransactionStatusType.UNKNOWN:
      return (
        <chakra.h4 mt="0.0625rem" ml="0.0625rem">
          ?
        </chakra.h4>
      )
    default:
      break
  }
}

const getStatusMessage = (status: TransactionStatusType) => {
  switch (status) {
    case TransactionStatusType.CONFIRMED:
      return 'Confirmed'
    case TransactionStatusType.PENDING:
      return 'Pending'
    case TransactionStatusType.EXPIRED:
      return 'Expired'
    case TransactionStatusType.UNCONFIRMED:
      return 'Awaiting confirmation'
    case TransactionStatusType.UNKNOWN:
      return 'Unknown'
    default:
      break
  }
}

const TransactionStatus: FC<TransactionStatusProps> = ({ status }) => {
  const bgColor = useColorModeValue(NAMED_COLORS.LIGHT_GREY, NAMED_COLORS.GREY)
  return (
    <Flex alignItems="center" gap="0.75rem">
      <Flex
        w="1.625rem"
        h="1.625rem"
        borderRadius="50%"
        alignItems="center"
        justifyContent="center"
        backgroundColor={
          status === TransactionStatusType.EXPIRED ? '#FFE2D9' : bgColor
        }
      >
        {getStatusIcon(status)}
      </Flex>
      <chakra.h5>{getStatusMessage(status)}</chakra.h5>
    </Flex>
  )
}

export default TransactionStatus
