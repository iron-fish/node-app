import './App.css'
import { IronFishUIProvider } from '@ironfish/ui-kit'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './routes'

import Action from './routes/Onboarding/Action'
import PageLayout from './routes/PageLayout'
import Accounts from './routes/Accounts/Accounts'
import CreateLayout from 'Routes/Onboarding/Layout'
import CreateAccount from 'Routes/Onboarding/CreateAccount'
import ImportAccount from 'Routes/Onboarding/ImportAccount'
import AddressBook from 'Routes/AddressBook'
import AccountDetails from 'Routes/Accounts/AccountDetails'
import Miner from 'Routes/Miner'
import Send from 'Routes/Send/Send'
import AddressDetails from 'Routes/AddressBook/AddressDetails'
import NodeOverview from 'Routes/NodeOverview/NodeOverview'
import ReceiveMoney from 'Routes/Receive/ReceiveMoney'
import ElectronThemeChangeHandler from 'Components/ElectronThemeChangeHandler'
import { useEffect, useState } from 'react'
import IronFishInitStatus from 'Types/IronfishInitStatus'

const breakpoints = {
  sm: '56.25rem', //900px
  sm1: '57.75rem', //924px
  sm2: '59.25rem', //948px
  md: '72rem', //1152px',
  md1: '77.5rem', //'1240px',
  lg: '90rem', //1440px',
  xl: '101.25rem', //1620px
  '2xl': '112.5rem', //1800px
}

function App() {
  const [initStatus, setInitStatus] = useState(IronFishInitStatus.NOT_STARTED)

  useEffect(() => {
    let interval: NodeJS.Timer | undefined
    if (
      initStatus !== IronFishInitStatus.READY &&
      initStatus !== IronFishInitStatus.ERROR
    ) {
      interval = setInterval(
        () => window.getIronfishManagerStatus().then(setInitStatus),
        250
      )
    }

    return () => interval && clearInterval(interval)
  }, [])

  return (
    <IronFishUIProvider theme={{ breakpoints }}>
      <ElectronThemeChangeHandler />
      <HashRouter>
        <Routes>
          <Route element={<CreateLayout />}>
            <Route path={ROUTES.ONBOARDING} element={<Action />} />
            <Route path={ROUTES.CREATE} element={<CreateAccount />} />
            <Route path={ROUTES.IMPORT} element={<ImportAccount />} />
          </Route>
          <Route element={<PageLayout />}>
            <Route path={ROUTES.ACCOUNT} element={<AccountDetails />} />
            <Route path={ROUTES.ACCOUNTS} element={<Accounts />} />
            <Route path={ROUTES.RECEIVE} element={<ReceiveMoney />} />
            <Route path={ROUTES.SEND} element={<Send />} />
            <Route path={ROUTES.ADDRESS_BOOK} element={<AddressBook />} />
            <Route
              path={ROUTES.ADDRESS_BOOK_DETAILS}
              element={<AddressDetails />}
            />
            <Route path={ROUTES.RESOURCES} element={null} />
            <Route path={ROUTES.NODE} element={<NodeOverview />} />
            <Route path={ROUTES.MINER} element={<Miner />} />
          </Route>
        </Routes>
      </HashRouter>
    </IronFishUIProvider>
  )
}

export default App
