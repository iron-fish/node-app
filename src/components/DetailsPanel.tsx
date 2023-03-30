import {
  Box,
  Button,
  useDisclosure,
  chakra,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  NAMED_COLORS,
  useColorModeValue,
} from '@ironfish/ui-kit'
import { FC, useRef, ReactNode } from 'react'
import InfoIcon from 'Svgx/Info'
import CloseIcon from 'Svgx/CloseIcon'
import { useDataSync } from 'Providers/DataSyncProvider'

interface DetailsPanelProps {
  children: ReactNode
}

const DetailsPanel: FC<DetailsPanelProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const bg = useColorModeValue(NAMED_COLORS.WHITE, NAMED_COLORS.LIGHT_BLACK)
  const { requiredSnapshot } = useDataSync()
  return (
    <>
      <Box
        display={{ base: 'none', md1: 'inline-block' }}
        p={{ md1: '0 2rem', lg: 0 }}
        ml={{ md1: '2rem', lg: '4rem' }}
      >
        {children}
      </Box>
      <Box
        display={{ base: 'none', md: 'inline-block', md1: 'none' }}
        ml="4rem"
      >
        <Button
          ref={btnRef}
          variant="secondary"
          p="1rem"
          borderRadius={{ md: '4rem' }}
          onClick={onOpen}
          leftIcon={<InfoIcon />}
        >
          <chakra.h5>Details</chakra.h5>
        </Button>
      </Box>
      <IconButton
        icon={<InfoIcon mb="0.25rem" />}
        aria-label={'account-keys-info-button'}
        borderRadius="50%"
        position="absolute"
        top={requiredSnapshot ? '4.5rem' : '1.5rem'}
        right="1.5rem"
        onClick={onOpen}
        display={{ base: 'block', md: 'none' }}
        variant="secondary"
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent p="4rem 4rem 2rem 4rem" maxWidth="29rem" bg={bg}>
          <DrawerCloseButton
            border={`0.0625rem solid ${NAMED_COLORS.LIGHT_GREY}`}
            borderRadius="50%"
            w="2.375rem"
            h="2.375rem"
            top="1.5rem"
            right="1.5rem"
            color={NAMED_COLORS.GREY}
            _focus={{
              boxShadow: 'none',
            }}
            _hover={{
              bg: 'none',
            }}
          >
            <CloseIcon />
          </DrawerCloseButton>
          {children}
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DetailsPanel
