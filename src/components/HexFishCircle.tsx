import { Flex, HexFish, FlexProps, NAMED_COLORS } from '@ironfish/ui-kit'

const HexFishCircle = (props: FlexProps) => {
  return (
    <Flex
      border="0.125rem solid"
      borderColor={NAMED_COLORS.BLACK}
      borderRadius="50%"
      mr="1rem"
      height="2.8rem"
      width="2.8rem"
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <HexFish style={{ height: '1rem' }} />
    </Flex>
  )
}

export default HexFishCircle
