import { FC, memo, useState } from 'react'
import {
  Flex,
  chakra,
  Box,
  Button,
  NAMED_COLORS,
  useColorModeValue,
  TextField,
} from '@ironfish/ui-kit'
import DetailsPanel from 'Components/DetailsPanel'
import AccountSettingsImage from 'Svgx/AccountSettingsImage'

const Information: FC = memo(() => {
  const textColor = useColorModeValue(
    NAMED_COLORS.GREY,
    NAMED_COLORS.LIGHT_GREY
  )
  return (
    <Box maxWidth="21.5rem">
      <chakra.h3 mb="1rem">Settings</chakra.h3>
      <chakra.h5 mb="2rem" color={textColor}>
        Changing your account name and preferred currency are a great way to
        personalize your wallet experience.
      </chakra.h5>
      <AccountSettingsImage />
    </Box>
  )
})

const ContactSettings = () => {
  const [name, setName] = useState('Frankie Boy')
  const [address, setAddress] = useState(
    '456tdgipedGP543DDHJOPahfjsidiwdowoae53d5'
  )

  const checkChanges: () => boolean = () => {
    return (
      name !== 'Frankie Boy' ||
      address !== '456tdgipedGP543DDHJOPahfjsidiwdowoae53d5'
    )
  }

  return (
    <Flex mt="2rem">
      <Flex width="100%" direction="column" gap="32px">
        <TextField
          label="Contact Name"
          value={name}
          InputProps={{
            onChange: e => setName(e.target.value),
          }}
        />
        <TextField
          label="Address"
          value={address}
          InputProps={{
            onChange: e => setAddress(e.target.value),
          }}
        />
        <Flex>
          <Button
            p="2rem"
            borderRadius="4.5rem"
            variant="primary"
            mr="2rem"
            disabled={!checkChanges()}
          >
            Save Changes
          </Button>
          <Button variant="link">Delete Contact</Button>
        </Flex>
      </Flex>
      <Box>
        <DetailsPanel>
          <Information />
        </DetailsPanel>
      </Box>
    </Flex>
  )
}

export default ContactSettings
