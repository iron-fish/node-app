import { FC, useMemo, useEffect, useState } from 'react'
import { Autocomplete, FlexProps, useDebounce } from '@ironfish/ui-kit'

import useAddressBook from 'Hooks/addressBook/useAddressBook'
import { Contact } from 'Data/types/Contact'
import { truncateHash } from 'Utils/hash'

interface ContactsAutocompleteProps extends FlexProps {
  contactId: string
  label: string
  onSelectOption?: (account: Contact) => void
}

const getContactOptions = (contacts: Contact[] = []) =>
  contacts.map((contact: Contact) => ({
    label: contact.name,
    helperText: truncateHash(contact.address, 2, 4),
    value: contact,
  }))

const ContactsAutocomplete: FC<ContactsAutocompleteProps> = ({
  contactId,
  label,
  onSelectOption,
  ...rest
}) => {
  const [$searchTerm, $setSearchTerm] = useState('')
  const $search = useDebounce($searchTerm, 500)
  const [{ data: contacts, loaded: contactsLoaded }] = useAddressBook($search)

  const options = useMemo(
    () => getContactOptions(contacts),
    [JSON.stringify(contacts)]
  )

  useEffect(() => {
    const selectedOption = options.find(
      ({ value }) => value.identity === contactId
    )
    onSelectOption(selectedOption?.value || null)
  }, [options])

  return (
    <Autocomplete
      label={label}
      options={options}
      value={options.find(({ value }) => value.identity === contactId)}
      onSelectOption={option => onSelectOption(option.value)}
      InputProps={{
        placeholder: 'Input Text',
        onChange: e => $setSearchTerm(e.target.value),
      }}
      {...rest}
    />
  )
}

export default ContactsAutocomplete
