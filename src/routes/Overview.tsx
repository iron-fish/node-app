import {
  NAMED_COLORS as C,
  HexFish as Logo,
  Flex,
  useColorMode,
} from '@ironfish/ui-kit'

import Navbar from '../components/Navbar'

export const Overview = () => {
  const { colorMode } = useColorMode()
  const isLightMode = colorMode === 'light'
  return (
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
          fill: isLightMode ? C.GREY : C.PALE_GREY,
        }}
      />
    </Flex>
  )
}

export default Overview
