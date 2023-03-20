import { FC } from 'react'
import { Flex, chakra, useColorModeValue, FlexProps } from '@ironfish/ui-kit'
import { useDataSync } from 'Providers/DataSyncProvider'

interface SyncWarningMessageProps extends FlexProps {
  message?: string
}

const SyncWarningMessage: FC<SyncWarningMessageProps> = ({
  message = 'Your account balance might not be accurate while you’re syncing to the blockchain',
  ...rest
}) => {
  const { synced } = useDataSync()
  const $colors = useColorModeValue(
    { text: '#7E7400', bg: '#FFF9BC' },
    {
      text: '#FFF9BC',
      bg: '#444123',
    }
  )
  return (
    <Flex
      display={synced ? 'none' : 'flex'}
      borderRadius="0.3125rem"
      bg={$colors.bg}
      height="4.3125rem"
      justifyContent="center"
      alignItems="center"
      px="1rem"
      {...rest}
    >
      <chakra.h4 color={$colors.text}>{message}</chakra.h4>
    </Flex>
  )
}

export default SyncWarningMessage
