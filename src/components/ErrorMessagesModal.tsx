import { Button, CheckIcon, Flex, Spinner, chakra } from '@ironfish/ui-kit'
import ModalWindow from './ModalWindow'
import { FC, useState } from 'react'
import IronFishInitStatus from 'Types/IronfishInitStatus'

interface NodeErrorMessagesModal {
  errors: Error[]
  nodeStatus: IronFishInitStatus
  collectDump: () => Promise<boolean>
  processError: () => Promise<void>
}

const NodeErrorMessagesModal: FC<NodeErrorMessagesModal> = ({
  errors,
  nodeStatus,
  collectDump,
  processError,
}) => {
  const [collectingDump, setCollectingDump] = useState(false)
  const [isDumpCollected, setDumpCollected] = useState(false)

  const handleDump = () => {
    setCollectingDump(true)
    collectDump().then(collected => {
      setDumpCollected(collected)
      setCollectingDump(false)
    })
  }

  return (
    !!errors?.length && (
      <ModalWindow isOpen={!!errors?.length} onClose={() => processError()}>
        <chakra.h2 mb="1rem">Error</chakra.h2>
        <chakra.h4 mb="1.5rem">{errors.at(-1).message}</chakra.h4>
        <Flex alignItems="center">
          <Button
            variant="primary"
            size="medium"
            mr="1.5rem"
            onClick={() => processError()}
          >
            Ok
          </Button>
          {nodeStatus >= IronFishInitStatus.INITIALIZED && !isDumpCollected && (
            <Button
              variant="primary"
              size="medium"
              mr="1.5rem"
              onClick={() => handleDump()}
              leftIcon={collectingDump ? <Spinner /> : null}
            >
              Dump
            </Button>
          )}
          {isDumpCollected && (
            <Flex alignItems="center">
              <CheckIcon mr="0.5rem" color="#357A48" />
              <chakra.h4>Dump collected</chakra.h4>
            </Flex>
          )}
        </Flex>
      </ModalWindow>
    )
  )
}

export default NodeErrorMessagesModal
