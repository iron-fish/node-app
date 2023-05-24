import { FC, ReactNode, useEffect, useState } from 'react'
import { Flex, Box, Progress, chakra, Steps, Step } from '@ironfish/ui-kit'
import sizeFormat from 'byte-size'
import {
  SnapshotProgressStatus,
  SnapshotProgressType,
} from 'Types/IronfishManager/IIronfishSnapshotManager'
import { formatRemainingTime } from 'Utils/remainingTimeFormat'
import EventType from 'Types/EventType'

enum STEPS {
  DOWNLOADING,
  PREPARING_DB,
  UPDATING_DB,
  CLEARING_TEMP,
  COMPLETED,
}

const getActiveStep = (status: SnapshotProgressStatus): number => {
  switch (status) {
    case SnapshotProgressStatus.NOT_STARTED:
    case SnapshotProgressStatus.DOWNLOADING:
      return STEPS.DOWNLOADING
    case SnapshotProgressStatus.CLEARING_CHAIN_DB:
      return STEPS.PREPARING_DB
    case SnapshotProgressStatus.UNARHIVING:
      return STEPS.UPDATING_DB
    case SnapshotProgressStatus.CLEARING_TEMP_DATA:
      return STEPS.CLEARING_TEMP
    case SnapshotProgressStatus.COMPLETED:
      return STEPS.COMPLETED
    default:
      return STEPS.DOWNLOADING
  }
}

const renderCount = (current: number, total: number) => {
  if (!total) {
    return null
  }

  return sizeFormat(current) + '/' + sizeFormat(total)
}

const StepProgress: FC<{
  status: Omit<SnapshotProgressType, 'statistic'> | null
  label?: ReactNode
}> = ({ status }) => (
  <Flex direction="column" m="4rem" alignItems="center" justifyContent="center">
    <Flex w="100%" justifyContent="space-between" alignItems="center">
      <Box>
        <chakra.h5>Progress</chakra.h5>
      </Box>
      <Box>
        <chakra.h5>{renderCount(status?.current, status?.total)}</chakra.h5>
      </Box>
    </Flex>
    <Box w="100%">
      <Progress
        size="md"
        borderRadius="1rem"
        value={
          status && status.total
            ? Math.round((status.current / status.total) * 100)
            : 0
        }
        isIndeterminate={
          !status ||
          !status.total ||
          status?.status === SnapshotProgressStatus.NOT_STARTED ||
          status?.status === SnapshotProgressStatus.COMPLETED
        }
      />
    </Box>
    <Box w="100%" textAlign="end">
      {status?.total && (
        <chakra.h5>{formatRemainingTime(status?.estimate || 0)}</chakra.h5>
      )}
    </Box>
  </Flex>
)

const steps = [
  {
    label: 'Download',
    step: STEPS.DOWNLOADING,
  },
  {
    label: 'Prepare',
    step: STEPS.PREPARING_DB,
  },
  {
    label: 'Update',
    step: STEPS.UPDATING_DB,
  },
  {
    label: 'Clear',
    step: STEPS.CLEARING_TEMP,
  },
]

const SnapshotFlow: FC = () => {
  const [status, setStatus] = useState<Omit<
    SnapshotProgressType,
    'statistic'
  > | null>(null)

  useEffect(() => {
    window.IronfishManager.snapshot.status().then(setStatus)
    window.subscribeOn(EventType.SNAPSHOT_STATUS_CHANGE, setStatus)
  }, [])

  useEffect(() => {
    if (status?.status === SnapshotProgressStatus.COMPLETED) {
      window.IronfishManager.start()
    }
  }, [status?.status])

  const activeStep = getActiveStep(status?.status)

  return (
    <Flex
      h="100vh"
      // w="100vw"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box w="100%" maxWidth="65.5rem" p="4rem" h="24rem">
        <Steps activeStep={activeStep}>
          {steps.map(({ label, step }) => (
            <Step
              label={label}
              isCompletedStep={activeStep > step}
              isKeepError={activeStep === step && status?.hasError}
              state={
                activeStep === step
                  ? status?.hasError
                    ? 'error'
                    : 'loading'
                  : undefined
              }
            >
              {status?.hasError ? (
                <Flex
                  w="100%"
                  alignItems="center"
                  justifyContent="center"
                  m="4rem"
                >
                  {status?.error}
                </Flex>
              ) : (
                <StepProgress status={status} />
              )}
            </Step>
          ))}
        </Steps>
      </Box>
    </Flex>
  )
}

export default SnapshotFlow
