import { FC, useMemo, useState } from 'react'
import {
  Box,
  Button,
  chakra,
  Flex,
  LightMode,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  NAMED_COLORS,
  Progress,
  Spinner,
} from '@ironfish/ui-kit'
import sizeFormat from 'byte-size'
import { useSnapshotStatus } from 'Providers/SnapshotProvider'
import { SnapshotProgressStatus } from 'Types/IronfishManager/IIronfishSnapshotManager'
import { formatRemainingTime } from 'Utils/remainingTimeFormat'

const getProgressStatusDesc = (status: SnapshotProgressStatus) => {
  switch (status) {
    case SnapshotProgressStatus.DOWNLOADING:
      return 'Downloading...'
    case SnapshotProgressStatus.DOWNLOADED:
      return 'Preparing...'
    case SnapshotProgressStatus.CLEARING_CHAIN_DB:
      return 'Clearing Database...'
    case SnapshotProgressStatus.CLEARING_TEMP_DATA:
      return 'Clearing temp files...'
    case SnapshotProgressStatus.UNARHIVING:
      return 'Unarchiving...'
    default:
      return ''
  }
}
const getContent = (status: SnapshotProgressStatus) => {
  switch (status) {
    case SnapshotProgressStatus.DOWNLOADING:
    case SnapshotProgressStatus.DOWNLOADED:
      return {
        title: 'Downloading Snapshot',
        description:
          'Downloading a snapshot is the fastest way to update your chain database.',
      }
    case SnapshotProgressStatus.CLEARING_CHAIN_DB:
    case SnapshotProgressStatus.CLEARING_TEMP_DATA:
    case SnapshotProgressStatus.UNARHIVING:
      return {
        title: 'Updating Chain Database',
        description:
          "Now that you’ve downloaded a snapshot, we need to replace your chain database. Please don't close the application.",
      }
    default:
      return { title: '', description: '' }
  }
}

const SnapshotStatusModal: FC<Omit<ModalProps, 'children'>> = props => {
  const { status, retry, reset } = useSnapshotStatus()
  const [loading, setLoading] = useState(false)
  const isDownloadingInProgress = useMemo(
    () =>
      status?.status > SnapshotProgressStatus.NOT_STARTED &&
      status?.status < SnapshotProgressStatus.DOWNLOADED,
    [status?.status]
  )
  const isApplyingInProgress = useMemo(
    () =>
      status?.status > SnapshotProgressStatus.DOWNLOADED &&
      status?.status < SnapshotProgressStatus.COMPLETED,
    [status?.status]
  )
  const content = useMemo(() => getContent(status?.status), [status?.status])
  const isIndeterminate = useMemo(
    () =>
      !status ||
      !status.total ||
      status?.status === SnapshotProgressStatus.NOT_STARTED ||
      status?.status === SnapshotProgressStatus.DOWNLOADED ||
      status?.status === SnapshotProgressStatus.COMPLETED ||
      status?.status === SnapshotProgressStatus.DECLINED,
    [status?.total, status?.status]
  )

  return (
    <LightMode>
      <Modal
        {...props}
        id="snapshot-status-modal"
        isOpen={
          status?.status > SnapshotProgressStatus.NOT_STARTED &&
          status?.status < SnapshotProgressStatus.COMPLETED
        }
        useInert={status?.status < SnapshotProgressStatus.COMPLETED}
        closeOnOverlayClick={false}
        onClose={() => {
          if (status?.hasError) {
            retry().finally(() => props?.onClose())
          } else {
            props?.onClose()
          }
        }}
      >
        <ModalOverlay background="rgba(0,0,0,0.75)" />
        <ModalContent p="4rem" minW="40rem" color={NAMED_COLORS.DEEP_BLUE}>
          <ModalHeader>
            <chakra.h2>{content.title}</chakra.h2>
          </ModalHeader>
          <ModalCloseButton
            display={
              isApplyingInProgress || isDownloadingInProgress
                ? 'none'
                : undefined
            }
            color={NAMED_COLORS.GREY}
            borderRadius="50%"
            borderColor={NAMED_COLORS.LIGHT_GREY}
            border="0.0125rem solid"
            mt="1.5rem"
            mr="1.5rem"
          />
          <ModalBody>
            <Box mb="2rem" hidden={status?.hasError}>
              <chakra.h4>{content.description}</chakra.h4>
            </Box>
            <Box mb="2rem" hidden={!status?.hasError}>
              <chakra.h4 color={NAMED_COLORS.RED}>{status?.error}</chakra.h4>
            </Box>
            <Flex alignItems="center" hidden={!status?.hasError}>
              <Button
                variant="primary"
                size="medium"
                mr="1rem"
                disabled={loading}
                onClick={() => {
                  setLoading(true)
                  retry().finally(() => setLoading(false))
                }}
                leftIcon={loading ? <Spinner /> : null}
              >
                Try again
              </Button>
              <Button
                variant="ghost"
                size="medium"
                colorScheme={NAMED_COLORS.GREY}
                onClick={() => {
                  reset().finally(() => props?.onClose())
                }}
              >
                Cancel
              </Button>
            </Flex>
            <Flex direction="column" hidden={status?.hasError}>
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
                  variant="ironLightBlue"
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
    </LightMode>
  )
}

export default SnapshotStatusModal
