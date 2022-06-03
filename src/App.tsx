import React from 'react'
import logo from './logo.svg'
import './App.css'
import { IronFishUIProvider, Box, ColorModeSwitcher } from '@ironfish/ui-kit'

function App() {
  return (
    <IronFishUIProvider>
      <ColorModeSwitcher />
      <Box className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </Box>
    </IronFishUIProvider>
  )
}

export default App
