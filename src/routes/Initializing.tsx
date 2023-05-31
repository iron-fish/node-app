import { Flex, Box } from '@ironfish/ui-kit'
import { FC, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import IronFishLogo from 'Svgx/IronFishLogo'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import ROUTES from './data'
import EventType from 'Types/EventType'
import NodeErrorMessagesModal from 'Components/ErrorMessagesModal'

const Initializing: FC = () => {
  const [initStatus, setInitStatus] = useState<IronFishInitStatus | null>(null)
  const [hasAnyAccount, setHasAnyAccount] = useState<boolean | null>(null)
  const [needsTelemetry, setNeedsTelemetry] = useState<boolean>(false)

  const [errors, setErrors] = useState<Error[]>([])
  const location = useLocation()
  const navigate = useNavigate()

  const loadInitStatus = () => {
    window.IronfishManager.status().then(setInitStatus)
  }
  const loadAccountCount = () => {
    window.IronfishManager.hasAnyAccount().then(setHasAnyAccount)
  }

  const loadNeedsTelemetry = () => {
    window.IronfishManager.getInternalConfig('isFirstRun').then(
      setNeedsTelemetry
    )
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
      loadNeedsTelemetry()
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
    if (needsTelemetry) {
      navigate(ROUTES.TELEMETRY)
    } else {
      navigate(ROUTES.ACCOUNTS)
    }
  }

  // const currentStep = getActiveStep(initStatus)
  return (
    <>
      {!hasErrors && initStatus >= IronFishInitStatus.INITIALIZED ? (
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
        </Flex>
      )}
    </>
  )
}

export default Initializing
