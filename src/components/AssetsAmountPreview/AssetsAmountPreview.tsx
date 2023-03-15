import {
  Flex,
  IconEye,
  chakra,
  Box,
  NAMED_COLORS,
  TextProps,
  Text,
  FlexProps,
} from '@ironfish/ui-kit'
import { FC, useState } from 'react'
import { Amount } from 'Types/Transaction'
import { formatOreToTronWithLanguage } from 'Utils/number'
import AssetsAmountPreviewModal from './AssetsAmountPreviewModal'

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

interface AssetsAmountPreviewProps {
  assetAmounts: Amount[]
  amountPreviewContainerProps?: FlexProps
  amountPreviewTextProps?: TextProps
}

const AssetsAmountPreview: FC<AssetsAmountPreviewProps> = ({
  assetAmounts = [],
  amountPreviewContainerProps,
  amountPreviewTextProps = { as: 'h5' },
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
      <AssetsAmountPreviewModal
        header="Transaction Assets"
        assetAmounts={assetAmounts}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

export default AssetsAmountPreview
