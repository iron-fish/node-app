import { FC, useState, useEffect } from 'react'
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
import IconAdd from '@ironfish/ui-kit/dist/svgx/icon-add'
import Send from 'Svgx/send'
import Caret from 'Svgx/caret-icon'
import HexFishCircle from 'Components/HexFishCircle'
import { truncateHash } from 'Utils/hash'
import SimpleTable from 'Components/SimpleTable'
import SearchSortField from 'Components/Search&Sort'
import useAddressBook from 'Hooks/addressBook/useAddressBook'
import Contact from 'Types/Contact'
import SortType from 'Types/SortType'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'Routes/data'
import AddContactModal from './AddContactModal'
import { useDataSync } from 'Providers/DataSyncProvider'
import { stringToColor } from 'Utils/stringToColor'
import EmptyOverview from 'Components/EmptyOverview'

const COLUMNS = [
  {
    key: 'contact',
    label: 'Contact',
    render: (contact: Contact) => (
      <Flex alignItems="center">
        <HexFishCircle mr="1rem" bg={stringToColor(contact._id, 73)} />
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
        md: truncateHash(contact.address, 2, 16),
        lg: contact.address,
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
    render: (contact: Contact) => {
      const navigate = useNavigate()
      const { loaded } = useDataSync()
      return (
        <Flex justify="flex-end" mr="-1.0625rem">
          <Box
            onClick={e => {
              e.stopPropagation()
              if (loaded) {
                navigate(ROUTES.SEND, { state: { contactId: contact?._id } })
              }
            }}
          >
            <Button
              leftIcon={
                <Icon height={8}>
                  <Send fill="currentColor" />
                </Icon>
              }
              variant="primary"
              borderRadius="4rem"
              isDisabled={!loaded}
              mr={{ base: '0.75rem', md: '1rem' }}
            >
              <h5>Send</h5>
            </Button>
          </Box>
          <IconButton
            aria-label="book-details"
            variant="ghost"
            icon={<Caret />}
            _active={{ bg: 'none' }}
            _hover={{ bg: 'none' }}
          />
        </Flex>
      )
    },
  },
]

const AddContactButton: FC<{
  onAdd: (name: string, address: string) => Promise<void>
}> = ({ onAdd }) => {
  const [openAddContactModal, setOpenAddContactModal] = useState<boolean>(false)

  return (
    <>
      <Button
        leftIcon={<IconAdd />}
        borderRadius="4rem"
        variant="secondary"
        onClick={() => setOpenAddContactModal(true)}
      >
        <chakra.h5>Add Contact</chakra.h5>
      </Button>
      <AddContactModal
        onAdd={(name, address) => {
          onAdd(name, address)
          setOpenAddContactModal(false)
        }}
        isOpen={openAddContactModal}
        onClose={() => setOpenAddContactModal(false)}
      />
    </>
  )
}

const AddressBook: FC = () => {
  const navigate = useNavigate()
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
  const [$sortOrder, $setSortOrder] = useState<SortType>(SortType.ASC)

  const [{ data: contacts = undefined, loaded }, addContact] = useAddressBook(
    $searchTerm,
    $sortOrder
  )
  const [isReady, setReady] = useState(false)
  const [isEmptyOverview, setEmptyOverview] = useState(false)

  useEffect(() => {
    if (loaded && contacts !== undefined && !isReady) {
      setReady(true)
      if (contacts.length === 0) {
        setEmptyOverview(true)
      }
    }
  }, [contacts, loaded])

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
          <AddContactButton
            onAdd={(name, address) =>
              addContact(name, address).then(() => {
                navigate(ROUTES.ADDRESS_BOOK)
                setEmptyOverview(false)
              })
            }
          />
        </Flex>
      </Flex>
      <Box display={isReady ? 'block' : 'none'}>
        {isEmptyOverview ? (
          <EmptyOverview
            header="You don’t have any contacts"
            description="Your address book is where you can manage all of your contacts, their names, and their public addresses"
          />
        ) : (
          <>
            <SearchSortField
              SearchProps={{
                onChange: e => $setSearchTerm(e.target.value),
              }}
              SortSelectProps={{
                onSelectOption: ({ value }) => $setSortOrder(value),
              }}
            />
            {contacts?.length === 0 ? (
              <EmptyOverview
                header="0 Results test"
                description="There aren’t any contact with details that match your search input."
              />
            ) : (
              <SimpleTable
                onRowClick={contact =>
                  navigate(ROUTES.ADDRESS_BOOK + `/${contact._id}`)
                }
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
            )}
          </>
        )}
      </Box>
    </>
  )
}

export default AddressBook
