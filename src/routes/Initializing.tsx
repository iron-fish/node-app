import { Flex, Box, Steps, Step } from '@ironfish/ui-kit'
import { FC, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import IronFishLogo from 'Svgx/IronFishLogo'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import ROUTES from './data'
import EventType from 'Types/EventType'

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
  const location = useLocation()
  const navigate = useNavigate()

  const loadInitStatus = () => {
    window.IronfishManager.status().then(setInitStatus)
    window.subscribeOn(EventType.INIT_STATUS_CHANGE, setInitStatus)
  }
  const loadAccountCount = () => {
    window.IronfishManager.hasAnyAccount().then(setHasAnyAccount)
    window.subscribeOn(EventType.ACCOUNTS_CHANGE, count =>
      setHasAnyAccount(count > 0)
    )
  }

  useEffect(() => {
    loadInitStatus()
  }, [])

  useEffect(() => {
    if (initStatus === null) {
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
  }, [initStatus, hasAnyAccount])

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

  return (
    <>
      {(initStatus === IronFishInitStatus.INITIALIZED &&
        hasAnyAccount === false) ||
      initStatus >= IronFishInitStatus.STARTED ? (
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
            <IronFishLogo height="4rem" isAnimated />
          </Box>
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
