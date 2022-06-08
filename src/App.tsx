import './App.css'
import { IronFishUIProvider } from '@ironfish/ui-kit'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './routes'

import Onboarding from './routes/Onboarding'
import Overview from './routes/Overview'

function App() {
  return (
    <IronFishUIProvider>
      <HashRouter>
        <Routes>
          <Route path={ROUTES.ONBOARDING} element={<Onboarding />} />
          <Route path={ROUTES.OVERVIEW} element={<Overview />} />
        </Routes>
      </HashRouter>
    </IronFishUIProvider>
  )
}

export default App
