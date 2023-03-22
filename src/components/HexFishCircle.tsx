import { Flex, HexFish, FlexProps, NAMED_COLORS } from '@ironfish/ui-kit'

const HexFishCircle = (props: FlexProps & { isAnimated?: boolean }) => {
  return (
    <Flex
      border="0.125rem solid"
      borderColor={NAMED_COLORS.BLACK}
      borderRadius="50%"
      mr="1rem"
      height="2.8rem"
      width="2.8rem"
      minH="2.8rem"
      minW="2.8rem"
      justifyContent="center"
      alignItems="center"
      animation={
        props.isAnimated
          ? 'opacity-animation 1s ease-in alternate infinite'
          : undefined
      }
      {...props}
    >
      <HexFish style={{ height: '1rem' }} />
    </Flex>
  )
}

export default HexFishCircle
