import {
  Tooltip,
  useColorMode,
  Text,
  HStack,
  NAMED_COLORS,
} from '@ironfish/ui-kit'

function Icon() {
  return (
    <svg width={14} height={15} fill="none">
      <path
        fill="currentColor"
        d="M6.55 10.833h1v-4h-1v4ZM7 5.6a.541.541 0 0 0 .392-.153.508.508 0 0 0 .158-.38.557.557 0 0 0-.158-.404A.524.524 0 0 0 7 4.5a.525.525 0 0 0-.392.163.557.557 0 0 0-.158.404c0 .15.053.277.158.38A.54.54 0 0 0 7 5.6Zm.004 8.567c-.919 0-1.783-.175-2.591-.525a6.774 6.774 0 0 1-2.121-1.434 6.77 6.77 0 0 1-1.434-2.122 6.465 6.465 0 0 1-.525-2.594c0-.92.175-1.785.525-2.595a6.67 6.67 0 0 1 1.434-2.114 6.842 6.842 0 0 1 2.122-1.425A6.465 6.465 0 0 1 7.008.833c.92 0 1.785.175 2.595.525a6.74 6.74 0 0 1 2.114 1.425c.6.6 1.075 1.306 1.425 2.117a6.48 6.48 0 0 1 .525 2.596c0 .919-.175 1.783-.525 2.591a6.808 6.808 0 0 1-1.425 2.118A6.73 6.73 0 0 1 9.6 13.64a6.447 6.447 0 0 1-2.596.528Zm.004-1c1.572 0 2.909-.553 4.009-1.659 1.1-1.105 1.65-2.444 1.65-4.016 0-1.573-.55-2.909-1.647-4.009-1.098-1.1-2.438-1.65-4.02-1.65-1.567 0-2.903.55-4.008 1.647C1.886 4.578 1.333 5.918 1.333 7.5c0 1.567.553 2.903 1.659 4.008 1.105 1.106 2.444 1.659 4.016 1.659Z"
      />
    </svg>
  )
}

export function ViewOnlyChip() {
  const isLightMode = useColorMode().colorMode === 'light'
  return (
    <Tooltip
      label="View only accounts cannot initiate transactions"
      placement="top"
    >
      <HStack
        alignItems="center"
        bg={isLightMode ? NAMED_COLORS.LIGHTER_GREY : NAMED_COLORS.DARKER_GREY}
        color={isLightMode ? NAMED_COLORS.GREY : NAMED_COLORS.PALE_GREY}
        spacing={1}
        borderRadius="full"
        border="1px solid transparent"
        px="8px"
        py="2px"
        _hover={{
          borderColor: isLightMode ? NAMED_COLORS.GREY : NAMED_COLORS.PALE_GREY,
        }}
      >
        <Icon />
        <Text fontSize="12px">View Only</Text>
      </HStack>
    </Tooltip>
  )
}
