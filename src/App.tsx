import React from 'react'
import './App.css'
import {
  NAMED_COLORS,
  HexFish as Logo,
  IronFishUIProvider,
  Flex,
  Box,
  ColorModeSwitcher,
  useColorMode,
} from '@ironfish/ui-kit'

function App() {
  const { colorMode } = useColorMode()
  return (
    <IronFishUIProvider>
      <Box
        position="absolute"
        top="1rem"
        zIndex={100}
        borderRadius="100rem"
        right="1rem"
      >
        <ColorModeSwitcher />
      </Box>
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
