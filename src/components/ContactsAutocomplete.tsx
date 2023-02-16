import { FC, useMemo, useEffect, useState, ReactNode, useRef } from 'react'
import {
  Autocomplete,
  FlexProps,
  NAMED_COLORS,
  useDebounce,
  chakra,
  Box,
  BoxProps,
} from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'

import useAddressBook from 'Hooks/addressBook/useAddressBook'
import Contact from 'Types/Contact'
import { truncateHash } from 'Utils/hash'

interface ContactsAutocompleteProps extends FlexProps {
  contactId?: string
  address: string
  label: string
  freeInput: boolean
  onSelectOption?: (account: Contact) => void
  containerProps?: BoxProps
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

const isValidPublicAddress = (address: string) =>
  address ? address?.length === 64 : true

const getSelectedOption = (
  options: ContactOption[] = [],
  address: string,
  freeInput: boolean
) => {
  let selectedOption = options?.find(
    o => o.value._id === address || o.value.address === address
  )

  if (freeInput && !selectedOption) {
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
  contactId,
  containerProps,
  ...rest
}) => {
  const [$searchTerm, $setSearchTerm] = useState('')
  const [$isValidAddress, setIsValidAddress] = useState(true)
  const $search = useDebounce($searchTerm, 500)
  const [{ data: contacts = [], loaded: contactsLoaded }, , reloadContacts] =
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

  useEffect(() => {
    const cont = contacts.find(({ _id }) => _id === contactId)
    if (contactId && contactId !== address && !cont && $searchTerm) {
      $setSearchTerm('')
      reloadContacts()
    }
  }, [contactId])

  return (
    <Box {...containerProps}>
      <Autocomplete
        label={label}
        options={options.length === 0 ? startOptions.current : options}
        value={getSelectedOption(options, address || $searchTerm, freeInput)}
        onSelectOption={option => {
          setIsValidAddress(isValidPublicAddress(option.value.address))
          onSelectOption(option.value)
        }}
        filterOption={getOptionsFilter(options, $searchTerm)}
        onClose={() => {
          if (freeInput && options.length === 0) {
            setIsValidAddress(isValidPublicAddress($searchTerm))
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
          setIsValidAddress(true)
        }}
        InputProps={{
          placeholder: 'Input Text',
          onChange: e => $setSearchTerm(e.target.value),
        }}
        sx={{
          ...(!$isValidAddress && {
            borderColor: `${NAMED_COLORS.RED} !important`,
          }),
        }}
        {...rest}
      />
      {!$isValidAddress && (
        <chakra.h5 mt="1rem" color={NAMED_COLORS.RED}>
          Invalid address. Recipient addresses are 64 characters long
        </chakra.h5>
      )}
    </Box>
  )
}

export default ContactsAutocomplete
