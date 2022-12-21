import './App.css'
import { extendTheme, IronFishUIProvider, useStyles } from '@ironfish/ui-kit'
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
import { DataSyncProvider } from './providers/DataSyncProvider'
import ElectronThemeChangeHandler from 'Components/ElectronThemeChangeHandler'
import Initializing from 'Routes/Initializing'
import { StepsStyleConfig as Steps } from 'chakra-ui-steps'
import theme from '@ironfish/ui-kit/dist/theme/theme'
import { useEffect } from 'react'
import SnapshotFlow from 'Routes/SnapshotFlow'

const breakpoints = {
  xs: '46.875rem', //750px
  sm: '56.25rem', //900px
  sm1: '57.75rem', //924px
  sm2: '59.25rem', //948px
  md: '72rem', //1152px',
  md1: '77.5rem', //'1240px',
  lg: '90rem', //1440px',
  xl: '101.25rem', //1620px
  '2xl': '112.5rem', //1800px
}

const walletTheme = extendTheme({
  ...theme,
  components: {
    ...theme.components,
    Steps: {
      ...Steps,
      baseStyle: props => {
        const styles = Steps.baseStyle(props)
        return {
          ...styles,
          stepContainer: {
            display: 'flex',
            alignItems: 'center',
            flexDir: 'column',
          },
          step: {
            display: 'flex',
            position: 'relative',
            alignItems: 'start',
          },
          connector: {
            ...styles.connector,
            mt: '1.25rem',
          },
          labelContainer: {
            display: 'flex',
            flexDir: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center',
            mt: '1rem',
            'span:first-of-type': {
              fontSize: '1.2rem',
            },
            'span:last-of-type': {
              fontSize: '0.8rem',
            },
          },
          description: {
            minH: '1.1rem',
            mt: '0.25rem',
          },
        }
      },
    },
  },
  breakpoints,
})

function App() {
  return (
    <IronFishUIProvider theme={walletTheme}>
      <ElectronThemeChangeHandler />
      <DataSyncProvider>
        <HashRouter>
          <Routes>
            <Route element={<Initializing />}>
              <Route element={<SnapshotFlow />} path={ROUTES.SNAPSHOT} />
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
                {/* <Route path={ROUTES.RESOURCES} element={null} /> */}
                <Route path={ROUTES.NODE} element={<NodeOverview />} />
                {/* <Route path={ROUTES.MINER} element={<Miner />} /> */}
              </Route>
            </Route>
          </Routes>
        </HashRouter>
      </DataSyncProvider>
    </IronFishUIProvider>
  )
}

export default App
