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
import {
  SnapshotManifest,
  SnapshotProgressStatus,
} from 'Types/IronfishManager/IIronfishSnapshotManager'
import log from 'electron-log'

const SnapshotDownloadModal: FC<
  Omit<ModalProps, 'children'> & {
    manifest: SnapshotManifest
    onConfirm: () => void
  }
> = ({ onConfirm, manifest, ...props }) => {
  const { checkPath, start, status } = useSnapshotStatus()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const displayError = status?.error ?? error

  const handleDownload = useCallback(async () => {
    setLoading(true)
    try {
      await start()
    } catch (e) {
      log.error(String(e))
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [manifest])

  const handleSyncing = useCallback(async () => {
    window.IronfishManager.snapshot.decline()
  }, [manifest])

  useEffect(() => {
    if (status && status.status !== SnapshotProgressStatus.NOT_STARTED) {
      onConfirm()
    }
  }, [status])

  useEffect(() => {
    if (!manifest) {
      return
    }

    setLoading(true)
    checkPath(manifest)
      .then(result => {
        setError(result.error)
      })
      .catch(e => {
        log.error(String(e))
        setError(String(e))
      })
      .finally(() => {
        setLoading(false)
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
            {displayError && (
              <chakra.h4 color={NAMED_COLORS.RED}>{displayError}</chakra.h4>
            )}
          </ModalBody>
          <ModalFooter justifyContent="flex-start">
            <Button
              marginRight="16px"
              variant="primary"
              size="medium"
              isDisabled={loading || displayError}
              onClick={handleDownload}
              leftIcon={loading ? <Spinner /> : null}
            >
              Download Snapshot
            </Button>
            <Button variant="primary" size="medium" onClick={handleSyncing}>
              Sync from Peers
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LightMode>
  )
}

export default SnapshotDownloadModal
