import './App.css'
import { IronFishUIProvider } from 'src/local-ui-kit'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './routes'

import Onboarding from './routes/Onboarding'
import Overview from './routes/Overview'

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
          <Route path={ROUTES.OVERVIEW} element={<Overview />} />
        </Routes>
      </HashRouter>
    </IronFishUIProvider>
  )
}

export default App
