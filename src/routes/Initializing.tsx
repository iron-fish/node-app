import { Flex, Box } from '@ironfish/ui-kit'
import { Step, Steps } from 'chakra-ui-steps'
import { FC, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import IronFishLogo from 'Svgx/IronFishLogo'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import ROUTES from './data'

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

    if (initStatus === IronFishInitStatus.INITIALIZED && hasAnyAccount) {
      interval = setInterval(loadInitStatus, 1000)
      window.IronfishManager.start()
    }

    return () => interval && clearInterval(interval)
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

  return (initStatus === IronFishInitStatus.INITIALIZED &&
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
            state={currentStep === STEPS.INITIALIZATION ? 'loading' : undefined}
            description={getInitializationStatusDesc(initStatus)}
            isCompletedStep={initStatus >= IronFishInitStatus.INITIALIZED}
          />
          <Step
            label="Check accounts"
            state={currentStep === STEPS.CHECKS ? 'loading' : undefined}
            description={currentStep === STEPS.CHECKS ? 'Get accounts...' : ' '}
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
  )
}

export default Initializing
