import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import DemoDataManager from './data/DemoDataManager'
import noop from 'lodash/noop'
// import { IronfishSdk } from '@ironfish/sdk'

declare global {
  interface Window {
    DemoDataManager: DemoDataManager
    setElectronThemeMode: (mode: string) => void
    // Wallet: IronfishSdk
  }
}

window.DemoDataManager = new DemoDataManager()
if (!window.setElectronThemeMode) {
  window.setElectronThemeMode = noop
}

ReactDOM.render(<App />, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
