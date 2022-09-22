import { FC, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  chakra,
  NAMED_COLORS,
  CopyValueToClipboard,
  useBreakpointValue,
  useColorModeValue,
} from '@ironfish/ui-kit'
import { Link } from 'react-router-dom'
import IconAdd from '@ironfish/ui-kit/dist/svgx/icon-add'
import Send from 'Svgx/send'
import Caret from 'Svgx/caret-icon'
import HexFishCircle from 'Components/HexFishCircle'
import { truncateHash } from 'Utils/hash'
import SimpleTable from 'Components/SimpleTable'
import SearchSortField from 'Components/Search&Sort'
import useAddressBook from 'Hooks/addressBook/useAddressBook'
import { Contact } from 'Data/types/Contact'

const getIconBg = (address = '') => {
  let colorNumber = 0
  Array.from(address).forEach(char => {
    colorNumber += char.charCodeAt(0)
  })

  return `hsl(${colorNumber % 255}, 100%, 73%)`
}

const COLUMNS = [
  {
    key: 'contact',
    label: 'Contact',
    render: (contact: Contact) => (
      <Flex alignItems="center">
        <HexFishCircle
          mr="1rem"
          bg={getIconBg(contact.address + contact.name)}
        />
        <h5>{contact.name}</h5>
      </Flex>
    ),
  },
  {
    key: 'address',
    label: 'Address',
    render: (contact: Contact) => {
      const addressLabel = useBreakpointValue({
        base: truncateHash(contact.address, 2, 9),
        md: contact.address,
      })
      return (
        <CopyValueToClipboard
          iconButtonProps={{
            justifyContent: 'none',
            minW: '0.75rem',
            color: NAMED_COLORS.GREY,
          }}
          labelProps={{
            mr: '0.5rem',
          }}
          value={contact.address}
          label={<chakra.h5>{addressLabel}</chakra.h5>}
          copyTooltipText="Copy to clipboard"
          copiedTooltipText="Copied"
        />
      )
    },
  },
  {
    key: 'actions',
    label: '',
    render: (contact: Contact) => (
      <Flex justify="flex-end" mr="-1.0625rem">
        <Button
          leftIcon={
            <Icon height={8}>
              <Send fill="currentColor" />
            </Icon>
          }
          variant="primary"
          borderRadius="4rem"
          mr={{ base: '0.75rem', md: '1rem' }}
        >
          <h5>Send</h5>
        </Button>
        <IconButton
          aria-label="book-details"
          variant="ghost"
          icon={<Caret />}
          as={Link}
          to={contact?.identity}
          _active={{ bg: 'none' }}
          _hover={{ bg: 'none' }}
        />
      </Flex>
    ),
  },
]

const AddressBook: FC = () => {
  const $colors = useColorModeValue(
    {
      hoverBorder: NAMED_COLORS.DEEP_BLUE,
      caretColor: NAMED_COLORS.PALE_GREY,
    },
    {
      hoverBorder: NAMED_COLORS.WHITE,
      caretColor: NAMED_COLORS.PALE_GREY,
    }
  )

  const [$searchTerm, $setSearchTerm] = useState('')
  const [$sortOrder, $setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [{ data: contacts, loaded }, addContact] = useAddressBook(
    $searchTerm,
    $sortOrder
  )

  return (
    <>
      <Flex
        mb="2.5rem"
        justifyContent="space-between"
        w="100%"
        alignItems="center"
      >
        <Flex direction="column">
          <Box>
            <h2>Address Book</h2>
          </Box>
        </Flex>
        <Flex>
          <Button
            leftIcon={<IconAdd />}
            borderRadius="4rem"
            variant="secondary"
          >
            <h5>Add Contact</h5>
          </Button>
        </Flex>
      </Flex>
      <SearchSortField
        SearchProps={{
          onChange: e => $setSearchTerm(e.target.value),
        }}
        SortSelectProps={{
          onSelectOption: ({ value }) => $setSortOrder(value),
        }}
      />
      <Flex direction="column" width="100%">
        <SimpleTable
          data={loaded ? contacts : new Array(10).fill(null)}
          columns={COLUMNS}
          sx={{
            tr: {
              '[aria-label="book-details"]': {
                color: $colors.caretColor,
              },
              _hover: {
                '[aria-label="book-details"]': {
                  color: $colors.hoverBorder,
                },
              },
            },
          }}
        />
      </Flex>
    </>
  )
}

export default AddressBook
