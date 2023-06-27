import {
  Button,
  chakra,
  LightMode,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  NAMED_COLORS,
  Spinner,
} from '@ironfish/ui-kit'
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

  const handleSyncing = useCallback(async () => {
    window.IronfishManager.snapshot.decline()
    onConfirm()
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
      <Modal {...props} closeOnOverlayClick={false}>
        <ModalOverlay background="rgba(0,0,0,0.75)" />
        <ModalContent p="4rem" minW="40rem" color={NAMED_COLORS.DEEP_BLUE}>
          <ModalHeader>
            <chakra.h2>Syncing your chain</chakra.h2>
          </ModalHeader>
          <ModalBody>
            <chakra.h4>
              Choose how to sync your app with the blockchain: <br />
              <br /> Download Snapshot: Fast and centralized. Get a complete
              copy quickly from a central source. This method ensures efficiency
              and consistent data. <br /> <br />
              Sync from Peers: Slower but decentralized. Retrieve the blockchain
              from other users, contributing to network decentralization. While
              it may take longer, it strengthens the network's resilience.{' '}
            </chakra.h4>
            {error && <chakra.h4 color={NAMED_COLORS.RED}>{error}</chakra.h4>}
          </ModalBody>
          <ModalFooter justifyContent="flex-start">
            <Button
              marginRight="16px"
              variant="primary"
              size="medium"
              disabled={loading}
              onClick={handleDownload}
              leftIcon={loading ? <Spinner /> : null}
            >
              Download Snapshot
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={handleSyncing}
            >
              Sync from Peers
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LightMode>
  )
}

export default SnapshotDownloadModal
