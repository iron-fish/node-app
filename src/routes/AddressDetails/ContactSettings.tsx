import { FC, memo, useState, useEffect } from 'react'
import {
  Flex,
  chakra,
  Box,
  Button,
  NAMED_COLORS,
  useColorModeValue,
  TextField,
  Link,
} from '@ironfish/ui-kit'
import DetailsPanel from 'Components/DetailsPanel'
import AccountSettingsImage from 'Svgx/AccountSettingsImage'
import { Contact } from 'Data/types/Contact'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from 'Routes/data'

interface ContactSettingsProps {
  contact: Contact
  onUpdate?: (name: string, address: string) => void
  onDelete?: (identity: string) => Promise<boolean>
}

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

const ContactSettings: FC<ContactSettingsProps> = ({
  contact,
  onUpdate,
  onDelete,
}) => {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (contact) {
      setName(contact.name)
      setAddress(contact.address)
    }
  }, [JSON.stringify(contact)])

  const checkChanges: () => boolean = () => {
    return name !== contact?.name || address !== contact?.address
  }

  return (
    <Flex mt="2rem">
      <Flex width="100%" direction="column" gap="2rem">
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
            onClick={() => onUpdate(name, address)}
          >
            Save Changes
          </Button>
          <Link
            alignSelf="center"
            onClick={() => {
              onDelete(contact.identity).then(
                deleted => deleted && navigate(ROUTES.ADDRESS_BOOK)
              )
            }}
          >
            <h4>Delete Contact</h4>
          </Link>
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
