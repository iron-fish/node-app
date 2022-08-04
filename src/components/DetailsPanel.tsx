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
} from '@ironfish/ui-kit'
import { FC, useRef } from 'react'
import InfoIcon from 'Svgx/Info'

const DetailsPanel: FC = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  return (
    <>
      <Box display={{ base: 'none', lg: 'inline-block' }}>{children}</Box>
      <Box display={{ base: 'none', md: 'inline-block', lg: 'none' }}>
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
        top="1.5rem"
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
        <DrawerContent p="2rem 4rem 2rem 2rem" maxWidth="29rem">
          <DrawerCloseButton border="1px solid" borderRadius="50%" />
          {children}
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DetailsPanel
