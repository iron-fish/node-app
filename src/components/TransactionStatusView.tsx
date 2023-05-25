import { FC } from 'react'
import {
  Flex,
  NAMED_COLORS,
  useColorModeValue,
  chakra,
  IconProps,
  PendingIcon,
  ExpiredIcon,
} from '@ironfish/ui-kit'
import { TransactionStatus } from 'Types/Transaction'
import IconSend from 'Svgx/send'
import IconReceive from 'Svgx/receive'

interface TransactionStatusProps {
  status: TransactionStatus
  isSent: boolean
}

const LIGHT_MODE = {
  sent: {
    bg: '#FFE4DC',
    icon: '#F15929',
  },
  received: {
    bg: '#EBFBF4',
    icon: '#335A48',
  },
  pending: {
    bg: '#FEF8C3',
    icon: '#7C7322',
  },
  default: {
    bg: NAMED_COLORS.LIGHT_GREY,
    icon: NAMED_COLORS.GREY,
  },
}

const DARK_MODE = {
  sent: {
    bg: '#3E251B',
    icon: '#F15929',
  },
  received: {
    bg: '#192D23',
    icon: '#5FC89A',
  },
  pending: {
    bg: '#403B10',
    icon: '#E7D95C',
  },
  default: {
    bg: NAMED_COLORS.DARK_GREY,
    icon: NAMED_COLORS.WHITE,
  },
}

interface StatusParams {
  iconColors: { bg: string; icon: string }
  message: string
  icon?: FC
}

const getStatusParams = (
  status: TransactionStatus,
  isSent: boolean
): StatusParams => {
  const colors = useColorModeValue(LIGHT_MODE, DARK_MODE)
  const params: StatusParams = {
    message: '',
    iconColors: colors.default,
  }
  switch (status) {
    case TransactionStatus.CONFIRMED:
      params.icon = (props: IconProps) =>
        isSent ? (
          <IconSend width="0.875rem" height="0.875rem" {...props} />
        ) : (
          <IconReceive width="0.875rem" height="0.875rem" {...props} />
        )
      params.message = isSent ? 'Sent' : 'Received'
      params.iconColors = isSent ? colors.sent : colors.received
      break
    case TransactionStatus.PENDING:
    case TransactionStatus.UNKNOWN:
    case TransactionStatus.UNCONFIRMED:
      params.icon = PendingIcon
      params.message = 'Pending'
      params.iconColors = colors.pending
      break
    case TransactionStatus.EXPIRED:
      params.icon = ExpiredIcon
      params.message = 'Expired'
      break
    default:
      break
  }
  return params
}

const TransactionStatusView: FC<TransactionStatusProps> = ({
  status,
  isSent,
}) => {
  const { icon, iconColors, message } = getStatusParams(status, isSent)
  const Icon = icon as FC<IconProps>
  return (
    <Flex alignItems="center" gap="0.75rem">
      <Flex
        w="1.625rem"
        h="1.625rem"
        borderRadius="50%"
        alignItems="center"
        justifyContent="center"
        backgroundColor={iconColors.bg}
      >
        <Icon color={iconColors.icon} />
      </Flex>
      <chakra.h5>{message}</chakra.h5>
    </Flex>
  )
}

export default TransactionStatusView
