import './App.css'
import { IronFishUIProvider } from '@ironfish/ui-kit'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './routes'

import Onboarding from './routes/Onboarding'
import PageLayout from './routes/PageLayout'
import Accounts from './routes/Accounts'
import AddressBook from 'Routes/AddressBook'
import AddressBookDetails from 'Routes/AddressBookDetails'

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
          <Route path={ROUTES.ONBOARDING} element={<Onboarding />} />
          <Route element={<PageLayout />}>
            <Route path={ROUTES.ACCOUNTS} element={<Accounts />} />
            <Route path={ROUTES.SEND} element={null} />
            <Route path={ROUTES.RECEIVE} element={null} />
            <Route path={ROUTES.ADDRESS_BOOK} element={<AddressBook />} />
            <Route
              path={ROUTES.ADDRESS_BOOK_DETAILS}
              element={<AddressBookDetails />}
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
