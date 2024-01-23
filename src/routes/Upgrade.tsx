import { Flex, Text, Button, HStack } from '@ironfish/ui-kit'
import ArrowRight from 'Svgx/ArrowRight'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { BLOCK_EXPLORER_URL } from 'Utils/constants'

const Upgrade: FC = () => {
  return (
    <Flex height="100vh" flexDirection="column">
      <Flex
        position="sticky"
        width="100%"
        bg="linear-gradient(90deg, #FFC2E8 0%, #DE83F0 100%)"
        py="16px"
        px="10px"
        top="0"
        justifyContent="center"
      >
        <HStack gap="16px">
          <Text>
            This version of the app will no longer be updated. Please uninstall
            and download Node App 2.0.
          </Text>
          <Button
            variant="primary"
            bg="transparent"
            borderRadius="4rem"
            color="black"
            borderColor="black"
            flexShrink="0"
            rightIcon={<ArrowRight />}
            _hover={{
              bg: 'rgba(255, 255, 255, 0.75)',
            }}
            onClick={() =>
              window.IronfishManager.openLink(`https://ironfish.network/use/node-app`)
            }
          >
            Download
          </Button>
        </HStack>
      </Flex>
      <Outlet />
    </Flex>
  )
}

export default Upgrade
