import {
  CopyValueToClipboard,
  Flex,
  IconEye,
  chakra,
  Box,
  NAMED_COLORS,
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@ironfish/ui-kit'
import useContact from 'Hooks/addressBook/useContactByAddress'
import { FC, useState } from 'react'
import { Note } from 'Types/Transaction'
import { truncateHash } from 'Utils/hash'
import { formatOreToTronWithLanguage } from 'Utils/number'
import SimpleTable from './SimpleTable'

const ContactPreview: FC<{ address: string }> = ({ address }) => {
  const contact = useContact(address)
  return (
    <CopyValueToClipboard
      label={
        <chakra.h5>
          {contact?.data ? contact.data.name : truncateHash(address, 2)}
        </chakra.h5>
      }
      value={address}
      copyTooltipText={'Copy address'}
      copiedTooltipText={'Address successfuly copied'}
      iconButtonProps={{
        color: NAMED_COLORS.GREY,
      }}
    />
  )
}

const ContactsPreview: FC<{ addresses?: string[]; notes?: Note[] }> = ({
  addresses = [],
  notes = [],
}) => {
  const [open, setOpen] = useState<boolean>(false)
  if (addresses.length === 0) {
    return null
  }

  if (addresses.length === 1) {
    return <ContactPreview address={addresses[0]} />
  }

  return (
    <>
      <Flex
        alignItems="center"
        cursor="pointer"
        onClick={e => {
          setOpen(true)
          e.stopPropagation()
        }}
      >
        <Box mr="0.5rem">
          <chakra.h5>{addresses.length + ' Addresses'}</chakra.h5>
        </Box>
        <IconEye color={NAMED_COLORS.GREY} crossed={true} />
      </Flex>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ModalOverlay background="rgba(0,0,0,0.75)" />
        <ModalContent p="4rem" minW="40rem">
          <ModalHeader>Transaction Addresses</ModalHeader>
          <ModalCloseButton
            color={NAMED_COLORS.GREY}
            borderRadius="50%"
            borderColor={NAMED_COLORS.LIGHT_GREY}
            border="0.0125rem solid"
            mt="1.5rem"
            mr="1.5rem"
          />
          <ModalBody>
            <SimpleTable
              data={notes}
              columns={[
                {
                  key: 'to-address',
                  label: 'To',
                  render: (note: Note) => (
                    <ContactPreview address={note.sender} />
                  ),
                },
                {
                  key: 'amount',
                  label: '$IRON',
                  render: (note: Note) =>
                    formatOreToTronWithLanguage(note.value),
                },
                {
                  key: 'memo',
                  label: 'MEMO',
                  render: (note: Note) => note.memo,
                },
              ]}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ContactsPreview
