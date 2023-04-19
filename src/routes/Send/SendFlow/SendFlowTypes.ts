import { ModalProps } from '@ironfish/ui-kit'
import Asset from 'Types/Asset'
import Contact from 'Types/Contact'
import CutAccount from 'Types/CutAccount'
import Transaction from 'Types/Transaction'

export interface StepProps extends SendProps {
  onConfirm: () => void
  onCancel: () => void
}

export interface SendProps {
  from: CutAccount
  to: Contact
  amount: bigint
  asset: Asset
  fee: bigint
  feeAsset?: Asset
  memo: string
  transaction: Transaction | null
  onCreateAccount: (contact: Contact) => void
}

export interface SendFlowProps extends Omit<ModalProps, 'children'>, SendProps {
  cleanUp: () => void
}
