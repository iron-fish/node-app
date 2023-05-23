import { Button, CheckIcon, Flex, Spinner, chakra, Input, Textarea, CopyValueToClipboard, NAMED_COLORS } from '@ironfish/ui-kit'
import ModalWindow from './ModalWindow'
import { FC, useEffect, useState } from 'react'
import IronFishInitStatus from 'Types/IronfishInitStatus'

interface NodeErrorMessagesModal {
  errors: Error[]
  nodeStatus: IronFishInitStatus
  collectDump: () => Promise<string>
  processError: () => Promise<void>
}

const NodeErrorMessagesModal: FC<NodeErrorMessagesModal> = ({
  errors,
  nodeStatus,
  collectDump,
  processError,
}) => {
  const [collectingDump, setCollectingDump] = useState(false)
  const [collectedDump, setCollectedDump] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (nodeStatus >= IronFishInitStatus.INITIALIZED && collectedDump === undefined) {
      setCollectingDump(true)
      collectDump().then(collected => {
        setCollectedDump(collected)
        setCollectingDump(false)
      })
    }
  })

  return (
    !!errors?.length && (
      <ModalWindow isOpen={!!errors?.length} onClose={() => processError()}>
        <chakra.h2 mb="1rem">Node App Error</chakra.h2>
        <chakra.h4>The application encountered an exception:</chakra.h4>
        <chakra.h4 mb="2rem">
          {errors.at(-1).message}
        </chakra.h4>
        <Flex
          mb="0.5rem"
        >
          <chakra.h5 mr="8px">Configuration and Crash Details</chakra.h5>
          <CopyValueToClipboard
            label=""
            value={collectedDump}
            copyTooltipText="Copy Crash Report to Clipboard"
            copiedTooltipText="Copied"
            iconButtonProps={{
              color: NAMED_COLORS.GREY,
            }}
          />
        </Flex>
        {collectingDump && <Spinner />}
        {!collectingDump && collectedDump !== undefined &&
          <Textarea
            isReadOnly
            value={collectedDump}
            size="sm"
            resize="none"
            mb="2rem"
            height="120px"
            fontFamily="monospace"
          />
        }
        <Button
          variant="primary"
          size="medium"
          mr="1.5rem"
          onClick={() => processError()}
        >
          Ok
        </Button>
      </ModalWindow>
    )
  )
}

export default NodeErrorMessagesModal
