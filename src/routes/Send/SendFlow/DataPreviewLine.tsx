import { FC, ReactNode } from 'react'
import { chakra, Flex, NAMED_COLORS, StyleProps } from '@ironfish/ui-kit'

interface DataPreviewLineProps extends StyleProps {
  title: ReactNode
  value: ReactNode
}

const DataPreviewLine: FC<DataPreviewLineProps> = ({
  title,
  value,
  ...props
}) => (
  <Flex
    borderBottom="0.0625rem dotted"
    borderColor={NAMED_COLORS.LIGHT_GREY}
    pb="1rem"
    {...props}
  >
    <chakra.h5 w="100%" color={NAMED_COLORS.GREY}>
      {title}
    </chakra.h5>
    {value}
  </Flex>
)

export default DataPreviewLine
