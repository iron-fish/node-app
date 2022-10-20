import { Flex } from '@ironfish/ui-kit'
import { FC, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import IronFishInitStatus from 'Types/IronfishInitStatus'
import ROUTES from './data'

const Initializing: FC = () => {
  const [initStatus, setInitStatus] = useState<IronFishInitStatus | null>(null)
  const [hasAnyAccount, setHasAnyAccount] = useState<boolean | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  const loadInitStatus = () => {
    window.IronfishManager.status().then(setInitStatus)
  }

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

    if (initStatus === IronFishInitStatus.INITIALIZED && !hasAnyAccount) {
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
    initStatus === IronFishInitStatus.INITIALIZED &&
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

  return (initStatus === IronFishInitStatus.INITIALIZED &&
    hasAnyAccount === false) ||
    initStatus === IronFishInitStatus.STARTED ? (
    <Outlet />
  ) : (
    <Flex h="100vh" w="100vw" justifyContent="center" alignItems="center">
      {initStatus === null && 'Get information from server'}
      {initStatus === IronFishInitStatus.NOT_STARTED &&
        'Starting initialization'}
      {initStatus === IronFishInitStatus.INITIALIZING_SDK &&
        'Initializing Iron Fish SDK'}
      {initStatus === IronFishInitStatus.INITIALIZING_NODE &&
        'Initializing Iron Fish Node'}
      {initStatus === IronFishInitStatus.STARTING_NODE &&
        'Starting Iron Fish Node'}
      {initStatus === IronFishInitStatus.STARTING_NODE &&
        'Starting Iron Fish Node'}
      {initStatus === IronFishInitStatus.ERROR && 'Something went wrong'}
    </Flex>
  )
}

export default Initializing
