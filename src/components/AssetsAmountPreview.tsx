import {
  Flex,
  IconEye,
  chakra,
  Box,
  NAMED_COLORS,
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  LightMode,
  TextProps,
  Text,
  FlexProps,
} from '@ironfish/ui-kit'
import { FC, useState } from 'react'
import { Amount } from 'Types/Transaction'
import { formatOreToTronWithLanguage } from 'Utils/number'
import SimpleTable from './SimpleTable'

interface AmountPreviewProps {
  assetAmount: Amount
  containerProps: FlexProps
  textProps: TextProps
}

const AmountPreview: FC<AmountPreviewProps> = ({
  assetAmount,
  containerProps,
  textProps,
}) => {
  return (
    <Flex flexWrap="wrap" {...containerProps}>
      <Text {...textProps}>
        {formatOreToTronWithLanguage(assetAmount.value)}
      </Text>
      &nbsp;
      <Text {...textProps}>{assetAmount.asset.name}</Text>
    </Flex>
  )
}

interface AssetsAmountPreview {
  assetAmounts: Amount[]
  amountPreviewContainerProps?: FlexProps
  amountPreviewTextProps?: TextProps
}

const AssetsAmountPreview: FC<AssetsAmountPreview> = ({
  assetAmounts = [],
  amountPreviewContainerProps,
  amountPreviewTextProps = { as: 'h5' } as TextProps,
}) => {
  const [open, setOpen] = useState<boolean>(false)
  if (assetAmounts.length === 0) {
    return null
  }

  if (assetAmounts.length === 1) {
    return (
      <AmountPreview
        assetAmount={assetAmounts[0]}
        containerProps={amountPreviewContainerProps}
        textProps={amountPreviewTextProps}
      />
    )
  }

  return (
    <>
      <Flex
        alignItems="center"
        cursor="pointer"
        onClick={e => {
          setOpen(true)
          e.stopPropagation()
        }}
      >
        <Box mr="0.5rem">
          <chakra.h5>{assetAmounts.length + ' Assets'}</chakra.h5>
        </Box>
        <IconEye color={NAMED_COLORS.GREY} crossed={true} />
      </Flex>
      <LightMode>
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <ModalOverlay background="rgba(0,0,0,0.75)" />
          <ModalContent p="4rem" minW="40rem">
            <ModalHeader color={NAMED_COLORS.DEEP_BLUE}>
              <h2>Transaction Assets</h2>
            </ModalHeader>
            <ModalCloseButton
              color={NAMED_COLORS.GREY}
              borderRadius="50%"
              borderColor={NAMED_COLORS.LIGHT_GREY}
              border="0.0125rem solid"
              mt="1.5rem"
              mr="1.5rem"
            />
            <ModalBody>
              <SimpleTable
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
    </>
  )
}

export default AssetsAmountPreview
