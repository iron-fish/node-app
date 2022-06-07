import React from 'react'
import './App.css'
import {
  NAMED_COLORS,
  HexFish as Logo,
  IronFishUIProvider,
  Flex,
  useColorMode,
} from '@ironfish/ui-kit'

import Navbar from './components/Navbar'

function App() {
  const { colorMode } = useColorMode()
  return (
    <IronFishUIProvider>
      <Flex
        top="0"
        position="absolute"
        className="App"
        justifyContent="center"
        alignItems="center"
        height="100%"
        minHeight="100vh"
        width="100%"
      >
        <Navbar />
        <Logo
          style={{
            maxWidth: '10rem',
            fill:
              colorMode === 'dark' ? NAMED_COLORS.PALE_GREY : NAMED_COLORS.GREY,
          }}
        />
      </Flex>
    </IronFishUIProvider>
  )
}

export default App
