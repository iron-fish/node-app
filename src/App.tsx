import './App.css'
import { IronFishUIProvider } from '@ironfish/ui-kit'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './routes'

import Onboarding from './routes/Onboarding'
import PageLayout from './routes/PageLayout'
import Accounts from './routes/Accounts'

function App() {
  return (
    <IronFishUIProvider>
      <HashRouter>
        <Routes>
          <Route path={ROUTES.ONBOARDING} element={<Onboarding />} />
          <Route element={<PageLayout />}>
            <Route path={ROUTES.ACCOUNTS} element={<Accounts />} />
            <Route path={ROUTES.SEND} element={null} />
            <Route path={ROUTES.RECEIVE} element={null} />
            <Route path={ROUTES.ADDRESS_BOOK} element={null} />
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
