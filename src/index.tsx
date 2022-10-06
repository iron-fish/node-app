import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'
import DemoDataManager from './data/DemoDataManager'
import { IronfishSdk } from '@ironfish/sdk'
import AddressBookStorageProps from '../electron/storage/types/AddressBookStorageProps'

declare global {
  interface Window {
    DemoDataManager: DemoDataManager
    Wallet: IronfishSdk
    AddressBookStorage: AddressBookStorageProps
  }
}

console.log(window.AddressBookStorage)

window.DemoDataManager = new DemoDataManager()

ReactDOM.render(<App />, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
