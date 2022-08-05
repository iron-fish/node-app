import './App.css'
import { IronFishUIProvider } from '@ironfish/ui-kit'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './routes'

import Action from './routes/Onboarding/Action'
import PageLayout from './routes/PageLayout'
import Accounts from './routes/Accounts'
import CreateLayout from 'Routes/Onboarding/Layout'
import CreateAccount from 'Routes/Onboarding/CreateAccount'
import ImportAccount from 'Routes/Onboarding/ImportAccount'
import AddressBook from 'Routes/AddressBook'
import AddressDetails from 'Routes/AddressDetails'

const breakpoints = {
  sm: '56.25rem',
  sm1: '57.75rem',
  md: '72rem',
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
            <Route path={ROUTES.ACCOUNTS} element={<Accounts />} />
            <Route path={ROUTES.SEND} element={null} />
            <Route path={ROUTES.RECEIVE} element={null} />
            <Route path={ROUTES.ADDRESS_BOOK} element={<AddressBook />} />
            <Route
              path={ROUTES.ADDRESS_BOOK_DETAILS}
              element={<AddressDetails />}
            />
            <Route path={ROUTES.RESOURCES} element={null} />
            <Route path={ROUTES.NODE} element={null} />
            <Route path={ROUTES.MINER} element={null} />
          </Route>
        </Routes>
      </HashRouter>
    </IronFishUIProvider>
  )
}

export default App
