import {
  NAMED_COLORS as C,
  HexFish as Logo,
  Flex,
  useColorMode,
  Box,
} from '@ironfish/ui-kit'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import Navbar from '../components/Navbar'

export const PageLayout: FC = () => {
  const { colorMode } = useColorMode()
  const isLightMode = colorMode === 'light'
  return (
    <Flex
      top="0"
      className="App"
      justifyContent="center"
      // alignItems="center"
      minHeight="100vh"
    >
      <Navbar />
      {/* <Logo
        style={{
          position: 'fixed',
          width: '10rem',
          left: '50%',
          top: '50%',
          fill: isLightMode ? C.GREY : C.PALE_GREY,
          zIndex: -1,
        }}
      /> */}
      <Box
        marginLeft={{ base: '6rem', sm: '17rem' }}
        marginRight="2rem"
        w="100%"
        maxWidth="65.5rem"
      >
        <Outlet />
      </Box>
    </Flex>
  )
}

export default PageLayout
