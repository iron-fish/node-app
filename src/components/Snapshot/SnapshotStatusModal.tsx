import { FC, useMemo } from 'react'
import {
  Box,
  chakra,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  NAMED_COLORS,
  Progress,
} from '@ironfish/ui-kit'
import sizeFormat from 'byte-size'
import { useSnapshotStatus } from 'Providers/SnapshotProvider'
import { ProgressStatus } from 'Types/IronfishManager/IIronfishSnapshotManager'
import { formatRemainingTime } from 'Utils/remainingTimeFormat'

const getProgressStatusDesc = (status: ProgressStatus) => {
  switch (status) {
    case ProgressStatus.DOWLOADING:
      return 'Downloading...'
    case ProgressStatus.DOWNLOADED:
      return 'Preparing...'
    case ProgressStatus.CLEARING_CHAIN_DB:
      return 'Clearing Database...'
    case ProgressStatus.CLEARING_TEMP_DATA:
      return 'Clearing temp files...'
    case ProgressStatus.UNARHIVING:
      return 'Unarchiving...'
    default:
      return ''
  }
}
const getContent = (status: ProgressStatus) => {
  switch (status) {
    case ProgressStatus.DOWLOADING:
    case ProgressStatus.DOWNLOADED:
      return {
        title: 'Downloading Snapshot',
        description:
          'Downloading snapshot is the fastest way to update your chain database.',
      }
    case ProgressStatus.CLEARING_CHAIN_DB:
    case ProgressStatus.CLEARING_TEMP_DATA:
    case ProgressStatus.UNARHIVING:
      return {
        title: 'Updating Chain Database',
        description:
          "Since you’ve downloaded our snapshot, we need to clear and update your chain database. Please, don't close application.",
      }
    default:
      return { title: '', description: '' }
  }
}

const SnapshotStatusModal: FC<Omit<ModalProps, 'children'>> = props => {
  const { status } = useSnapshotStatus()
  const isApplyingInProgress = useMemo(
    () =>
      status?.status > ProgressStatus.DOWNLOADED &&
      status?.status < ProgressStatus.COMPLETED,
    [status?.status]
  )
  const content = useMemo(() => getContent(status?.status), [status?.status])
  const isIndeterminate = useMemo(
    () =>
      !status ||
      !status.total ||
      status?.status === ProgressStatus.NOT_STARTED ||
      status?.status === ProgressStatus.DOWNLOADED ||
      status?.status === ProgressStatus.COMPLETED,
    [status?.total, status?.status]
  )

  return (
    <Modal {...props} isOpen={isApplyingInProgress ? true : props.isOpen}>
      <ModalOverlay background="rgba(0,0,0,0.75)" />
      <ModalContent p="4rem" minW="40rem">
        <ModalHeader>
          <chakra.h2>{content.title}</chakra.h2>
        </ModalHeader>
        <ModalCloseButton
          display={isApplyingInProgress ? 'none' : undefined}
          color={NAMED_COLORS.GREY}
          borderRadius="50%"
          borderColor={NAMED_COLORS.LIGHT_GREY}
          border="0.0125rem solid"
          mt="1.5rem"
          mr="1.5rem"
        />
        <ModalBody>
          <Box mb="2rem">
            <chakra.h4>{content.description}</chakra.h4>
            {status?.hasError && (
              <chakra.h4 color={NAMED_COLORS.RED}>{status?.error}</chakra.h4>
            )}
          </Box>
          <Flex direction="column">
            <Flex
              w="100%"
              alignItems="center"
              justifyContent="space-between"
              mb="0.5rem"
            >
              <Box>
                <chakra.h4>
                  {(status?.total
                    ? Math.round((status.current / status.total) * 100)
                    : 0) + '% Complete'}
                </chakra.h4>
              </Box>
              <Box>
                <chakra.h5 color={NAMED_COLORS.GREY}>
                  {status?.estimate
                    ? formatRemainingTime(status?.estimate)
                    : '~'}
                </chakra.h5>
              </Box>
            </Flex>
            <Box w="100%">
              <Progress
                size="md"
                borderRadius="1rem"
                value={
                  status?.total
                    ? Math.round((status.current / status.total) * 100)
                    : 0
                }
                isIndeterminate={isIndeterminate}
              />
            </Box>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              mt="0.5rem"
            >
              <Box>
                <chakra.h5 color={NAMED_COLORS.GREY}>
                  {getProgressStatusDesc(status?.status)}
                </chakra.h5>
              </Box>
              <Box>
                <chakra.h5 color={NAMED_COLORS.GREY}>
                  {isIndeterminate
                    ? ' '
                    : sizeFormat(status?.current || 0).toString() +
                      ' / ' +
                      sizeFormat(status?.total || 0)}
                </chakra.h5>
              </Box>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SnapshotStatusModal
