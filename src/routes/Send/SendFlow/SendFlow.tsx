import { FC, useEffect, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalOverlay,
  NAMED_COLORS,
  LightMode,
} from '@ironfish/ui-kit'
import Transaction from 'Types/Transaction'
import Asset from 'Types/Asset'
import ConfirmStep from './ConfirmStep'
import ResultStep from './ResultStep'
import { StepProps, SendFlowProps } from './SendFlowTypes'

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
  const [currStep, setCurrentStep] = useState<number>(0)
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [feeAsset, setFeeAsset] = useState<Asset>()

  useEffect(() => {
    window.IronfishManager.assets.default().then(setFeeAsset)
  }, [])

  const Step = STEPS[currStep]

  const handleClose = () => {
    setCurrentStep(0)
    props.onClose && props.onClose()
    if (props.cleanUp && currStep > 0) {
      props.cleanUp()
    }
  }

  const send = () =>
    window.IronfishManager.transactions
      .send(
        from.id,
        {
          amount,
          memo,
          publicAddress: to.address,
          assetId: asset.id,
        },
        fee
      )
      .then(setTransaction)

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
