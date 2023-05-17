import { FC, useMemo, useEffect, useState, ReactNode, useRef } from 'react'
import {
  Autocomplete,
  FlexProps,
  NAMED_COLORS,
  chakra,
  Box,
  BoxProps,
  useDebounce,
} from '@ironfish/ui-kit'
import { OptionType } from '@ironfish/ui-kit/dist/components/SelectField'

import useAddressBook from 'Hooks/addressBook/useAddressBook'
import Contact from 'Types/Contact'
import { truncateHash } from 'Utils/hash'
import usePublicAddressValidator from 'Hooks/accounts/usePublicAddressValidator'
import TextFieldErrorMessage from './TextFieldErrorMessage'

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
  const $search = useDebounce($searchTerm, 500)
  const [{ data: contacts = [], loaded: contactsLoaded }, , reloadContacts] =
    useAddressBook($search)

  const isValidAccount = usePublicAddressValidator($search)

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
          onSelectOption(option.value)
        }}
        filterOption={getOptionsFilter(options, $searchTerm)}
        onClose={() => {
          if (freeInput && options.length === 0) {
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
          onChange: e => {
            const search = e.target.value
            if (!search) {
              onSelectOption(null)
            }
            $setSearchTerm(search)
          },
        }}
        sx={{
          ...($search &&
            !isValidAccount && {
              borderColor: `${NAMED_COLORS.RED} !important`,
            }),
        }}
        {...rest}
      />
      <TextFieldErrorMessage
        message="Invalid public address"
        showError={$search && !isValidAccount}
      />
    </Box>
  )
}

export default ContactsAutocomplete
