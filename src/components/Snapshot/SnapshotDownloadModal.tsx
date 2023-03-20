import {
  Button,
  chakra,
  LightMode,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  NAMED_COLORS,
  Spinner,
} from '@ironfish/ui-kit'
import DownloadIcon from '@ironfish/ui-kit/dist/svgx/download-icon'
import { useSnapshotStatus } from 'Providers/SnapshotProvider'
import { FC, useCallback, useEffect, useState } from 'react'
import { SnapshotManifest } from 'Types/IronfishManager/IIronfishSnapshotManager'

const SnapshotDownloadModal: FC<
  Omit<ModalProps, 'children'> & {
    manifest: SnapshotManifest
    size: string
    estimateTime: string
    onConfirm: () => void
  }
> = ({ size, estimateTime, onConfirm, manifest, ...props }) => {
  const { checkPath, start } = useSnapshotStatus()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [byDefault, setByDefault] = useState(true)

  const handleDownload = useCallback(async () => {
    setLoading(true)
    if (byDefault) {
      await start()
      onConfirm()
      setLoading(false)
      return
    }

    const path = await window.selectFolder()
    if (!path) {
      setLoading(false)
      return
    }

    const check = await checkPath(manifest, path)
    if (check.hasError) {
      setLoading(false)
      setError(check.error)
      return
    }

    await start(path)
    onConfirm()
    setLoading(false)
  }, [manifest, byDefault])

  useEffect(() => {
    manifest &&
      checkPath(manifest).then(result => {
        setLoading(false)
        setByDefault(!result.hasError)
      })
  }, [manifest])

  return (
    <LightMode>
      <Modal {...props}>
        <ModalOverlay background="rgba(0,0,0,0.75)" />
        <ModalContent p="4rem" minW="40rem" color={NAMED_COLORS.DEEP_BLUE}>
          <ModalHeader>
            <chakra.h2>Download Snapshot</chakra.h2>
          </ModalHeader>
          <ModalCloseButton
            color={NAMED_COLORS.GREY}
            borderRadius="50%"
            borderColor={NAMED_COLORS.LIGHT_GREY}
            border="0.0125rem solid"
            mt="1.5rem"
            mr="1.5rem"
          />
          <ModalBody>
            <chakra.h4>
              You need to download our chain snapshot as the normal download
              time could take up to {estimateTime}. The snapshot will be 2 times
              faster and only {size}.{' '}
              <Link display="none">If you need help, please click here.</Link>
            </chakra.h4>
            {error && <chakra.h4 color={NAMED_COLORS.RED}>{error}</chakra.h4>}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="primary"
              borderRadius="4rem"
              disabled={loading}
              onClick={handleDownload}
              leftIcon={loading ? <Spinner /> : <DownloadIcon />}
            >
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LightMode>
  )
}

export default SnapshotDownloadModal
