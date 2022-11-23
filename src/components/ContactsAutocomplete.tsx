import { FC, useMemo, useEffect, useState, ReactNode } from 'react'
import { Autocomplete, FlexProps, useDebounce } from '@ironfish/ui-kit'

import useAddressBook from 'Hooks/addressBook/useAddressBook'
import Contact from 'Types/Contact'
import { truncateHash } from 'Utils/hash'

interface ContactsAutocompleteProps extends FlexProps {
  contactId: string
  label: string
  freeInput: boolean
  onSelectOption?: (account: Contact) => void
}

interface ContactOption {
  label: ReactNode
  helperText?: ReactNode
  value: Contact
}

const getContactOptions = (contacts: Contact[] = []) =>
  contacts.map((contact: Contact) => ({
    label: contact.name,
    helperText: truncateHash(contact.address, 2, 4),
    value: contact,
  }))

const getSelectedOption = (
  options: ContactOption[] = [],
  contractId: string,
  freeInput: boolean
) => {
  let selectedOption = options?.find(o => o.value._id === contractId)

  if (freeInput && contractId) {
    selectedOption = {
      label: contractId,
      value: {
        _id: contractId,
        name: contractId,
        address: contractId,
      },
    }
  }

  return selectedOption
}

const ContactsAutocomplete: FC<ContactsAutocompleteProps> = ({
  contactId,
  label,
  freeInput,
  onSelectOption,
  ...rest
}) => {
  const [$searchTerm, $setSearchTerm] = useState('')
  const $search = useDebounce($searchTerm, 500)
  const [{ data: contacts = [], loaded: contactsLoaded }] =
    useAddressBook($search)

  const options = useMemo(
    () => getContactOptions(contacts),
    [JSON.stringify(contacts.map(c => c._id))]
  )

  useEffect(() => {
    const selectedOption = getSelectedOption(options, contactId, freeInput)
    onSelectOption(selectedOption?.value || null)
  }, [options])

  return (
    <Autocomplete
      label={label}
      options={options}
      value={getSelectedOption(options, contactId, freeInput)}
      onSelectOption={option => onSelectOption(option.value)}
      // onClose={() => {
      //   if (freeInput && options.length === 0) {
      //     onSelectOption({
      //       _id: $searchTerm,
      //       address: $searchTerm,
      //       name: $searchTerm,
      //     })
      //   }
      // }}
      InputProps={{
        placeholder: 'Input Text',
        onChange: e => $setSearchTerm(e.target.value),
        onKeyDown: e =>
          e.key === 'Enter' &&
          onSelectOption({
            _id: $searchTerm,
            address: $searchTerm,
            name: $searchTerm,
          }),
      }}
      {...rest}
    />
  )
}

export default ContactsAutocomplete
