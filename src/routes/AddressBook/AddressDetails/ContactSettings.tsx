import { FC, memo, useState, useEffect } from 'react'
import {
  Flex,
  chakra,
  Box,
  Button,
  NAMED_COLORS,
  TextField,
  Link,
  useIronToast,
  useDisclosure,
} from '@ironfish/ui-kit'
import DetailsPanel from 'Components/DetailsPanel'
import AccountSettingsImage from 'Svgx/AccountSettingsImage'
import Contact from 'Types/Contact'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from 'Routes/data'
import ModalWindow from 'Components/ModalWindow'

interface ContactSettingsProps {
  contact: Contact
  onUpdate?: (name: string, address: string) => Promise<void>
  onDelete?: (identity: string) => Promise<void>
}

const Information: FC = memo(() => {
  return (
    <Box maxWidth="21.5rem">
      <chakra.h3 mb="1rem">Settings</chakra.h3>
      <chakra.h5
        mb="2rem"
        color={NAMED_COLORS.GREY}
        _dark={{ color: NAMED_COLORS.LIGHT_GREY }}
      >
        Changing your account name is a great way to personalize your wallet
        experience.
      </chakra.h5>
      <AccountSettingsImage />
    </Box>
  )
})

interface RemoveContactButtonProps {
  contact: Contact
  onDelete: () => void
}

const RemoveContactButton: FC<RemoveContactButtonProps> = ({
  contact,
  onDelete,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Link alignSelf="center" onClick={onOpen}>
        <h4>Delete Contact</h4>
      </Link>
      <ModalWindow isOpen={isOpen} onClose={onClose}>
        <chakra.h2 mb="16px">Remove Contact</chakra.h2>
        <chakra.h4 mb="32px">
          You’re about to remove contact “{contact?.name}” from address book.
        </chakra.h4>
        <Flex>
          <Button
            variant="primary"
            size="medium"
            mr="1.5rem"
            bgColor="#F15929"
            onClick={() => {
              onDelete()
              onClose()
            }}
          >
            Remove Account
          </Button>
          <Link alignSelf="center" onClick={() => onClose()}>
            <h4>Cancel</h4>
          </Link>
        </Flex>
      </ModalWindow>
    </>
  )
}

const ContactSettings: FC<ContactSettingsProps> = ({
  contact,
  onUpdate,
  onDelete,
}) => {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const navigate = useNavigate()
  const toast = useIronToast({
    containerStyle: {
      mb: '1rem',
    },
  })

  useEffect(() => {
    if (contact) {
      setName(contact.name)
      setAddress(contact.address)
    }
  }, [JSON.stringify(contact)])

  const handleDelete = () =>
    onDelete(contact._id).then(() => {
      navigate(ROUTES.ADDRESS_BOOK)
      toast({ title: 'Contact Removed' })
    })

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
            onClick={() =>
              onUpdate(name, address).then(() =>
                toast({ title: 'Contact Details Updated' })
              )
            }
          >
            Save Changes
          </Button>
          <RemoveContactButton contact={contact} onDelete={handleDelete} />
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
