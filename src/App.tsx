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
import AddressDetails from 'Routes/AddressDetails'

const breakpoints = {
  sm: '56.25rem',
  sm1: '57.75rem',
  md: '72rem',
  md1: '77.5rem',
  lg: '90rem',
  xl: '101.25rem',
  '2xl': '112.5rem',
}

function App() {
  return (
    <IronFishUIProvider theme={{ breakpoints }}>
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
            <Route path={ROUTES.SEND} element={<Send />} />
            <Route path={ROUTES.RECEIVE} element={null} />
            <Route path={ROUTES.ADDRESS_BOOK} element={<AddressBook />} />
            <Route
              path={ROUTES.ADDRESS_BOOK_DETAILS}
              element={<AddressDetails />}
            />
            <Route path={ROUTES.RESOURCES} element={null} />
            <Route path={ROUTES.NODE} element={null} />
            <Route path={ROUTES.MINER} element={<Miner />} />
          </Route>
        </Routes>
      </HashRouter>
    </IronFishUIProvider>
  )
}

export default App
