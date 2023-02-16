import { Flex, Box } from '@ironfish/ui-kit'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import Navbar from '../components/Navbar'

export const PageLayout: FC = () => {
  return (
    <>
      <Flex top="0" className="App" justifyContent="center" minHeight={'100vh'}>
        <Navbar />
        <Box marginLeft={{ base: '6rem', sm: '17rem' }} w="100%">
          <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            px="2rem"
            py="2.5rem"
          >
            <Box width="100%" height="100%" maxWidth="65.5rem">
              <Outlet />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

export default PageLayout
