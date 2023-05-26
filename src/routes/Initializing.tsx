import { Flex, Box } from '@ironfish/ui-kit'
import { FC, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import IronFishLogo from 'Svgx/IronFishLogo'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import ROUTES from './data'
import EventType from 'Types/EventType'
import NodeErrorMessagesModal from 'Components/ErrorMessagesModal'

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

const Initializing: FC = () => {
  const [initStatus, setInitStatus] = useState<IronFishInitStatus | null>(null)
  const [hasAnyAccount, setHasAnyAccount] = useState<boolean | null>(null)
  const [errors, setErrors] = useState<Error[]>([])
  const location = useLocation()
  const navigate = useNavigate()

  const loadInitStatus = () => {
    window.IronfishManager.status().then(setInitStatus)
  }
  const loadAccountCount = () => {
    window.IronfishManager.hasAnyAccount().then(setHasAnyAccount)
  }
  const subscribeOnEvents = () => {
    window.subscribeOn(EventType.INIT_STATUS_CHANGE, setInitStatus)
    window.subscribeOn(EventType.ACCOUNTS_CHANGE, count =>
      setHasAnyAccount(count > 0)
    )
    window.subscribeOn(EventType.CRITICAL_ERROR, setErrors)
  }

  useEffect(() => {
    window.ErrorManager.getErrors().then(setErrors)
  }, [])

  const hasErrors = useMemo(
    () => initStatus === IronFishInitStatus.ERROR || !!errors?.length,
    [initStatus, errors]
  )

  useEffect(() => {
    loadInitStatus()
    subscribeOnEvents()
  }, [])

  useEffect(() => {
    if (initStatus === null) {
      return
    }

    if (hasErrors) {
      return
    }

    if (initStatus === IronFishInitStatus.NOT_STARTED) {
      window.IronfishManager.initialize()
      return
    }

    if (
      initStatus >= IronFishInitStatus.INITIALIZED &&
      hasAnyAccount === null
    ) {
      loadAccountCount()
      return
    }

    if (initStatus === IronFishInitStatus.INITIALIZED && hasAnyAccount) {
      window.IronfishManager.start()
    }
  }, [initStatus, hasAnyAccount, hasErrors])

  const handleProcessError = () =>
    window.ErrorManager.processError().then(setErrors)

  const collectDump = (dumpErrors: Error[]) =>
    window.IronfishManager.dump(dumpErrors)

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
      location.pathname === ROUTES.CREATE ||
      location.pathname === ROUTES.BASE)
  ) {
    navigate(ROUTES.ACCOUNTS)
  }

  // const currentStep = getActiveStep(initStatus)
  return (
    <>
      {!hasErrors &&
      ((initStatus === IronFishInitStatus.INITIALIZED &&
        hasAnyAccount === false) ||
        initStatus >= IronFishInitStatus.STARTED) ? (
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
            <IronFishLogo height="4rem" isAnimated={!hasErrors} />
          </Box>
          <NodeErrorMessagesModal
            errors={errors}
            nodeStatus={initStatus}
            collectDump={collectDump}
            processError={handleProcessError}
          />
          {/* <Box w="100%" maxWidth="65.5rem">
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
          </Box> */}
        </Flex>
      )}
    </>
  )
}

export default Initializing
