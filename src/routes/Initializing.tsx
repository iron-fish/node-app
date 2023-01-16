import {
  Flex,
  Box,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  DownloadIcon,
  Steps,
  Step,
} from '@ironfish/ui-kit'
import sizeFormat from 'byte-size'
import noop from 'lodash/noop'
import { FC, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import IronFishLogo from 'Svgx/IronFishLogo'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import { SnapshotManifest } from 'Types/IronfishManager/IIronfishSnapshotManager'
import ROUTES from './data'
import SnapshotFlow from './SnapshotFlow'

enum STEPS {
  INITIALIZATION,
  CHECKS,
  START,
  ERROR,
}

const getActiveStep = (status: IronFishInitStatus | null): STEPS => {
  switch (status) {
    case null:
    case IronFishInitStatus.NOT_STARTED:
    case IronFishInitStatus.INITIALIZING_NODE:
    case IronFishInitStatus.INITIALIZING_SDK:
      return STEPS.INITIALIZATION
    case IronFishInitStatus.INITIALIZED:
      return STEPS.CHECKS
    case IronFishInitStatus.STARTING_NODE:
    case IronFishInitStatus.STARTED:
      return STEPS.START
    default:
      return STEPS.INITIALIZATION
  }
}

const getInitializationStatusDesc = (
  status: IronFishInitStatus | null
): string | undefined => {
  switch (status) {
    case null:
    case IronFishInitStatus.NOT_STARTED:
      return 'Connecting...'
    case IronFishInitStatus.INITIALIZING_NODE:
      return 'Initializing Node...'
    case IronFishInitStatus.INITIALIZING_SDK:
      return 'Initializing SDK...'
    default:
      return ' '
  }
}

const SnapshotModal: FC<{
  open: boolean
  progress: number
  onConfirm: (path: string) => void
  onCancel: () => void
}> = ({ open, progress = 0, onCancel, onConfirm }) => {
  const [confirmed, setConfirmation] = useState<boolean>(false)
  const [path, setPath] = useState<string | null>(null)
  const [manifest, setManifest] = useState<SnapshotManifest>(null)

  useEffect(() => {
    window.IronfishManager.snapshot.manifest().then(setManifest)
  }, [])

  return (
    <Modal isOpen={open} onClose={noop}>
      <ModalOverlay background="rgba(0,0,0,0.75)" />
      <ModalContent p="4rem" minW="40rem">
        <ModalHeader>Download snapshot</ModalHeader>
        {!confirmed && (
          <ModalBody>
            Your progress of chain synchranization is low (
            <b>{(progress * 100).toFixed(2)}%</b>).
            <br /> We suggest to download chain snapshot (
            <b>
              {manifest ? sizeFormat(manifest.file_size).toString() : '...'}
            </b>
            ).
            <br /> It would be faster than continue synchronize it.
          </ModalBody>
        )}
        {confirmed && (
          <ModalBody>
            <Button
              variant="secondary"
              onClick={async () => {
                setPath(await window.selectFolder())
              }}
              mr="1rem"
            >
              Select path
            </Button>
            {path}
          </ModalBody>
        )}
        <ModalFooter>
          <Button
            mr="1rem"
            variant="primary"
            leftIcon={<DownloadIcon />}
            onClick={() =>
              confirmed ? onConfirm(path) : setConfirmation(true)
            }
            disabled={confirmed && !path}
          >
            {confirmed ? 'Start' : 'Download'}
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const Initializing: FC = () => {
  const [initStatus, setInitStatus] = useState<IronFishInitStatus | null>(null)
  const [chainProgress, setChainProgress] = useState<number | null>(null)
  const [hasAnyAccount, setHasAnyAccount] = useState<boolean | null>(null)
  const [cancelLoad, setCancelLoad] = useState<boolean>(false)
  const [download, setDownload] = useState<boolean>(false)
  const location = useLocation()
  const navigate = useNavigate()

  const loadInitStatus = () => {
    window.IronfishManager.status().then(setInitStatus)
  }

  const loadChainProgress = () => {
    window.IronfishManager.chainProgress().then(setChainProgress)
  }

  useEffect(() => {
    if (location?.state?.recheckAccounts) {
      window.IronfishManager.hasAnyAccount().then(setHasAnyAccount)
    }
  }, [location?.state?.recheckAccounts])

  useEffect(() => {
    let interval: NodeJS.Timer

    if (initStatus === null) {
      loadInitStatus()
    }

    if (
      initStatus === IronFishInitStatus.INITIALIZING_NODE ||
      initStatus === IronFishInitStatus.INITIALIZING_SDK ||
      initStatus === IronFishInitStatus.STARTING_NODE
    ) {
      interval = setInterval(loadInitStatus, 1000)
    }

    if (initStatus === IronFishInitStatus.NOT_STARTED) {
      interval = setInterval(loadInitStatus, 1000)
      window.IronfishManager.initialize()
    }

    if (initStatus >= IronFishInitStatus.INITIALIZED && !hasAnyAccount) {
      interval = setInterval(
        () => window.IronfishManager.hasAnyAccount().then(setHasAnyAccount),
        500
      )
    }

    if (initStatus === IronFishInitStatus.DOWNLOAD_SNAPSHOT) {
      interval = setInterval(() => {
        loadInitStatus()
      }, 1000)
    }

    if (initStatus === IronFishInitStatus.INITIALIZED && hasAnyAccount) {
      interval = setInterval(() => {
        loadChainProgress()
        loadInitStatus()
      }, 1000)
    }

    if (
      initStatus === IronFishInitStatus.INITIALIZED &&
      hasAnyAccount &&
      (cancelLoad || chainProgress > 0.5)
    ) {
      interval = setInterval(() => {
        loadInitStatus()
        loadChainProgress()
      }, 1000)
      window.IronfishManager.start()
    }

    return () => interval && clearInterval(interval)
  }, [initStatus, hasAnyAccount, chainProgress, cancelLoad])

  if (
    initStatus >= IronFishInitStatus.INITIALIZED &&
    hasAnyAccount === false &&
    location.pathname !== ROUTES.ONBOARDING &&
    location.pathname !== ROUTES.IMPORT &&
    location.pathname !== ROUTES.CREATE
  ) {
    navigate(ROUTES.ONBOARDING)
  }

  if (
    initStatus === IronFishInitStatus.STARTED &&
    hasAnyAccount &&
    (location.pathname === ROUTES.ONBOARDING ||
      location.pathname === ROUTES.IMPORT ||
      location.pathname === ROUTES.CREATE)
  ) {
    navigate(ROUTES.ACCOUNTS)
  }

  const currentStep = getActiveStep(initStatus)

  if (initStatus === IronFishInitStatus.DOWNLOAD_SNAPSHOT) {
    return <SnapshotFlow />
  }

  return (
    <>
      {(initStatus === IronFishInitStatus.INITIALIZED &&
        hasAnyAccount === false) ||
      initStatus === IronFishInitStatus.STARTED ? (
        <Outlet />
      ) : (
        <Flex
          h="100vh"
          w="100vw"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box mb="4rem">
            <IronFishLogo height="3rem" />
          </Box>
          <Box w="100%" maxWidth="65.5rem">
            <Steps activeStep={currentStep}>
              <Step
                label="Initialization"
                state={
                  currentStep === STEPS.INITIALIZATION ? 'loading' : undefined
                }
                description={getInitializationStatusDesc(initStatus)}
                isCompletedStep={initStatus >= IronFishInitStatus.INITIALIZED}
              />
              <Step
                label="Check accounts"
                state={currentStep === STEPS.CHECKS ? 'loading' : undefined}
                description={
                  currentStep === STEPS.CHECKS
                    ? hasAnyAccount === null
                      ? 'Get accounts...'
                      : 'Analyzing chain...'
                    : ' '
                }
                isCompletedStep={initStatus > IronFishInitStatus.INITIALIZED}
              />
              <Step
                label="Start node"
                state={currentStep === STEPS.START ? 'loading' : undefined}
                description={
                  initStatus === IronFishInitStatus.STARTING_NODE
                    ? 'Starting...'
                    : ' '
                }
                isCompletedStep={initStatus >= IronFishInitStatus.STARTED}
              />
            </Steps>
          </Box>
        </Flex>
      )}
      {!cancelLoad && !download && (
        <SnapshotModal
          open={chainProgress !== null && chainProgress < 0.5}
          progress={chainProgress}
          onCancel={() => setCancelLoad(true)}
          onConfirm={path => {
            setDownload(true)
            window.IronfishManager.downloadChainSnapshot(path)
          }}
        />
      )}
    </>
  )
}

export default Initializing
