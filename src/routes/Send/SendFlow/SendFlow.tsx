import { FC, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalOverlay,
  NAMED_COLORS,
  LightMode,
} from '@ironfish/ui-kit'
import ConfirmStep from './ConfirmStep'
import ResultStep from './ResultStep'
import { StepProps, SendFlowProps } from './SendFlowTypes'
import useSendFlow from 'Hooks/transactions/useSendFlow'

const STEPS: FC<StepProps>[] = [ConfirmStep, ResultStep]

const SendFlow: FC<Omit<SendFlowProps, 'transaction'>> = ({
  from,
  to,
  amount,
  memo,
  fee,
  asset,
  onCreateAccount,
  ...props
}) => {
  const {
    transaction,
    feeAsset,
    actions: { send },
  } = useSendFlow(from?.id, amount, memo, to?.address, asset?.id, fee)
  const [currStep, setCurrentStep] = useState<number>(0)
  const Step = STEPS[currStep]

  const handleClose = () => {
    setCurrentStep(0)
    props.onClose && props.onClose()
    if (props.cleanUp && currStep > 0) {
      props.cleanUp()
    }
  }

  return (
    <LightMode>
      <Modal
        {...props}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent
          w="37.5rem"
          maxW="37.5rem"
          p="4rem"
          color={NAMED_COLORS.DEEP_BLUE}
        >
          <Step
            from={from}
            to={to}
            amount={amount}
            asset={asset}
            fee={fee}
            feeAsset={feeAsset}
            memo={memo}
            onConfirm={() => {
              setCurrentStep(1)
              send()
            }}
            transaction={transaction}
            onCancel={handleClose}
            onCreateAccount={onCreateAccount}
          />
        </ModalContent>
      </Modal>
    </LightMode>
  )
}

export default SendFlow
