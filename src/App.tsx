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
// import Miner from 'Routes/Miner'
import Send from 'Routes/Send/Send'
import AddressDetails from 'Routes/AddressBook/AddressDetails'
import NodeOverview from 'Routes/NodeOverview/NodeOverview'
import ReceiveMoney from 'Routes/Receive/ReceiveMoney'
import Providers from './providers'
import ElectronThemeChangeHandler from 'Components/ElectronThemeChangeHandler'
import Initializing from 'Routes/Initializing'
import TransactionOverview from 'Routes/Transaction/TransactionOverview'
import Updates from 'Routes/Updates/Updates'
import Update from 'Routes/Updates/Update'
import { ReleaseNotesProviderWrapper } from 'Providers/ReleaseNotesProvider'

const breakpoints = {
  xs: '46.875rem', //750px
  sm: '56.25rem', //900px
  sm1: '57.75rem', //924px
  sm2: '59.25rem', //948px
  sm3: '62.5rem', //1000px
  sm4: '65.625rem', //1050px
  md: '72rem', //1152px',
  md1: '77.5rem', //'1240px',
  lg: '90rem', //1440px',
  xl: '101.25rem', //1620px
  '2xl': '112.5rem', //1800px
}

function App() {
  return (
    <IronFishUIProvider theme={{ breakpoints }}>
      <ElectronThemeChangeHandler />
      <HashRouter>
        <Routes>
          <Route element={<Initializing />}>
            <Route element={<Providers />}>
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
                  path={ROUTES.TRANSACTION}
                  element={<TransactionOverview />}
                />
                <Route
                  path={ROUTES.ADDRESS_BOOK_DETAILS}
                  element={<AddressDetails />}
                />
                {/* <Route path={ROUTES.RESOURCES} element={null} /> */}
                <Route path={ROUTES.NODE} element={<NodeOverview />} />
                <Route element={<ReleaseNotesProviderWrapper />}>
                  <Route path={ROUTES.UPDATE} element={<Update />} />
                  <Route path={ROUTES.UPDATES} element={<Updates />} />
                </Route>
                {/* <Route path={ROUTES.MINER} element={<Miner />} /> */}
              </Route>
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </IronFishUIProvider>
  )
}

export default App
