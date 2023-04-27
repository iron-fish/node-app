import {
  NAMED_COLORS,
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  LightMode,
} from '@ironfish/ui-kit'
import { FC, ReactNode } from 'react'
import { Amount } from 'Types/Transaction'
import { formatOreToTronWithLanguage } from 'Utils/number'
import SimpleTable from '../SimpleTable'

interface AssetsAmountPreviewModalProps {
  header: ReactNode
  assetAmounts: Amount[]
  isOpen: boolean
  onClose: () => void
}

export const AssetsAmountPreviewModal: FC<AssetsAmountPreviewModalProps> = ({
  header,
  assetAmounts,
  isOpen,
  onClose,
}) => {
  return (
    <LightMode>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay background="rgba(0,0,0,0.75)" />
        <ModalContent p="4rem" minW="40rem">
          <ModalHeader color={NAMED_COLORS.DEEP_BLUE}>
            <h2>{header}</h2>
          </ModalHeader>
          <ModalCloseButton
            color={NAMED_COLORS.GREY}
            borderRadius="50%"
            borderColor={NAMED_COLORS.LIGHT_GREY}
            border="0.0125rem solid"
            mt="1.5rem"
            mr="1.5rem"
            _focus={{
              boxShadow: 'none',
            }}
          />
          <ModalBody>
            <SimpleTable
              disableHover={true}
              data={assetAmounts}
              columns={[
                {
                  key: 'asset-name',
                  label: 'Asset Name',
                  render: (assetAmount: Amount) => assetAmount.asset.name,
                },
                {
                  key: 'asset-value',
                  label: 'Value',
                  render: (assetAmount: Amount) =>
                    formatOreToTronWithLanguage(assetAmount.value),
                },
              ]}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </LightMode>
  )
}

export default AssetsAmountPreviewModal
