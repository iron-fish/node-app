import { FC, ReactNode } from 'react'
import {
  Flex,
  VStack,
  chakra,
  useColorModeValue,
  NAMED_COLORS,
} from '@ironfish/ui-kit'
import EmptyOverviewImage from 'Svgx/EmptyOverviewImage'

interface EmptyOverviewProps {
  header: ReactNode
  description: ReactNode
}

const EmptyOverview: FC<EmptyOverviewProps> = ({
  header,
  description,
  ...props
}) => {
  const $fontColor = useColorModeValue(
    NAMED_COLORS.GREY,
    NAMED_COLORS.PALE_GREY
  )
  return (
    <Flex mt="2rem" justifyContent="center" {...props}>
      <VStack w="25rem">
        <chakra.h3 mb="1rem">{header}</chakra.h3>
        <chakra.h5 mb="1.5rem !important" textAlign="center" color={$fontColor}>
          {description}
        </chakra.h5>
        <EmptyOverviewImage />
      </VStack>
    </Flex>
  )
}

export default EmptyOverview
