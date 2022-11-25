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
  const $getAddressLabel = useBreakpointValue({
    base: address => truncateHash(address, 2, 9),
    md: address => truncateHash(address, 2, 16),
    lg: address => address,
  })

  const [$searchTerm, $setSearchTerm] = useState('')
  const [$sortOrder, $setSortOrder] = useState<SortType>(SortType.ASC)

  const { loaded: synced } = useDataSync()
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
          <AddContactButton onAdd={addContact} />
        </Flex>
      </Flex>
      <SearchSortField
        SearchProps={{
          onChange: e => $setSearchTerm(e.target.value),
        }}
        SortSelectProps={{
          onSelectOption: ({ value }) => $setSortOrder(value),
        }}
        options={[
          {
            label: 'Newest to oldest',
            value: SortType.DESC,
          },
          {
            label: 'Oldest to oldest',
            value: SortType.ASC,
          },
        ]}
      />
      <Flex direction="column" width="100%">
        <SimpleTable
          onRowClick={contact =>
            navigate(ROUTES.ADDRESS_BOOK + `/${contact._id}`)
          }
          data={loaded ? contacts : new Array(10).fill(null)}
          columns={[
            {
              key: 'contact',
              label: 'Contact',
              render: (contact: Contact) => (
                <Flex alignItems="center">
                  <HexFishCircle
                    mr="1rem"
                    bg={stringToColor(contact._id, 73)}
                  />
                  <h5>{contact.name}</h5>
                </Flex>
              ),
            },
            {
              key: 'address',
              label: 'Address',
              render: (contact: Contact) => {
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
                    label={
                      <chakra.h5>{$getAddressLabel(contact.address)}</chakra.h5>
                    }
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
                return (
                  <Flex justify="flex-end" mr="-1.0625rem">
                    <Box
                      onClick={e => {
                        e.stopPropagation()
                        if (synced) {
                          navigate(ROUTES.SEND, {
                            state: { contactId: contact?._id },
                          })
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
                        isDisabled={!synced}
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
          ]}
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
