import { FC, useMemo, useEffect, useState, ReactNode, useRef } from 'react'
import { Autocomplete, FlexProps, useDebounce } from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'

import useAddressBook from 'Hooks/addressBook/useAddressBook'
import Contact from 'Types/Contact'
import { truncateHash } from 'Utils/hash'

interface ContactsAutocompleteProps extends FlexProps {
  address: string
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

const isValidPublicAddress = (address: string) => address?.length === 86

const getSelectedOption = (
  options: ContactOption[] = [],
  address: string,
  freeInput: boolean
) => {
  let selectedOption = options?.find(
    o => o.value._id === address || o.value.address === address
  )

  if (freeInput && isValidPublicAddress(address) && !selectedOption) {
    selectedOption = {
      label: address,
      value: {
        _id: address,
        name: address,
        address: address,
      },
    }
  }

  return selectedOption
}

const optionsFilter = (option: OptionType, searchTerm: string) => {
  const { name, address } = option.value
  const _name = name?.toLowerCase()
  const _address = address?.toLowerCase()
  const _search = searchTerm.toLowerCase()

  return _name?.includes(_search) || _address?.includes(_search)
}

const getOptionsFilter = (options: ContactOption[], $searchTerm: string) => {
  const filteredOptions = options.filter(option =>
    optionsFilter(option, $searchTerm)
  )
  return filteredOptions.length ? optionsFilter : () => true
}

const ContactsAutocomplete: FC<ContactsAutocompleteProps> = ({
  address,
  label,
  freeInput,
  onSelectOption,
  ...rest
}) => {
  const [$searchTerm, $setSearchTerm] = useState('')
  const $search = useDebounce($searchTerm, 500)
  const [{ data: contacts = [], loaded: contactsLoaded }] =
    useAddressBook($search)

  const startOptions = useRef([])

  const options = useMemo(() => {
    const contactOptions = getContactOptions(contacts)
    if (startOptions.current.length === 0) {
      startOptions.current = contactOptions
    }
    return contactOptions
  }, [JSON.stringify(contacts.map(c => c._id))])

  useEffect(() => {
    const selectedOption = getSelectedOption(
      options,
      address || $searchTerm,
      freeInput
    )
    onSelectOption(selectedOption?.value || null)
  }, [options])

  return (
    <Autocomplete
      label={label}
      options={options.length === 0 ? startOptions.current : options}
      value={getSelectedOption(options, address || $searchTerm, freeInput)}
      onSelectOption={option => {
        onSelectOption(option.value)
        $setSearchTerm('')
      }}
      filterOption={getOptionsFilter(options, $searchTerm)}
      onClose={() => {
        if (
          freeInput &&
          options.length === 0 &&
          isValidPublicAddress($searchTerm)
        ) {
          onSelectOption({
            _id: $searchTerm,
            address: $searchTerm,
            name: $searchTerm,
          })
        }
      }}
      isClearable={true}
      onClear={() => {
        onSelectOption(null)
        $setSearchTerm('')
      }}
      InputProps={{
        placeholder: 'Input Text',
        onChange: e => $setSearchTerm(e.target.value),
      }}
      {...rest}
    />
  )
}

export default ContactsAutocomplete
