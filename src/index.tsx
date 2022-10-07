import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'
import DemoDataManager from './data/DemoDataManager'
import { IronfishSdk } from '@ironfish/sdk'
import IStorage from '../electron/storage/types/IStorage'
import Contact from '../electron/storage/types/Contact'
import AccountSettings from '../electron/storage/types/AccountSettings'

declare global {
  interface Window {
    DemoDataManager: DemoDataManager
    Wallet: IronfishSdk
    AddressBookStorage: IStorage<Contact>
    AccountSettingsStorage: IStorage<AccountSettings>
  }
}

console.log(window.AddressBookStorage)
console.log(window.AccountSettingsStorage)

window.DemoDataManager = new DemoDataManager()

ReactDOM.render(<App />, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
