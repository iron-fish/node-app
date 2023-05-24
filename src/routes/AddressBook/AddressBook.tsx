import { FC, useState, useEffect, useDeferredValue } from 'react'
import {
  Box,
  Button,
  Flex,
  Icon,
  chakra,
  NAMED_COLORS,
  CopyValueToClipboard,
  useBreakpointValue,
  useIronToast,
  IconAdd,
} from '@ironfish/ui-kit'
import SendIcon from 'Svgx/send'
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
import EmptyOverview from 'Components/EmptyOverview'
import { accountGradientByOrder } from 'Utils/accountGradientByOrder'
import { ACTIONS_COLUMN } from 'Components/WalletCommonTable'

const AddContactButton: FC<{
  onAdd: (name: string, address: string) => Promise<Contact>
}> = ({ onAdd }) => {
  const [openAddContactModal, setOpenAddContactModal] = useState<boolean>(false)
  const toast = useIronToast({
    title: 'Contact Created',
    containerStyle: {
      mb: '1rem',
    },
  })

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
          onAdd(name, address).then(() => toast())
          setOpenAddContactModal(false)
        }}
        isOpen={openAddContactModal}
        onClose={() => setOpenAddContactModal(false)}
      />
    </>
  )
}

const ContactSearch: FC<{ contactsAmount: number }> = ({ contactsAmount }) => {
  const navigate = useNavigate()
  const $getAddressLabel = useBreakpointValue({
    base: (address: string) => truncateHash(address, 2, 3),
    sm: (address: string) => truncateHash(address, 2, 6),
    md: (address: string) => truncateHash(address, 2, 12),
    lg: (address: string) => truncateHash(address, 2, 18),
  })

  const [$searchTerm, $setSearchTerm] = useState('')
  const [$sortOrder, $setSortOrder] = useState<SortType>(SortType.ASC)

  const { synced } = useDataSync()
  const [{ data: contacts, loaded }, , reloadContacts] = useAddressBook(
    $searchTerm,
    $sortOrder
  )
  const contactsLoaded = useDeferredValue(loaded)

  useEffect(() => {
    reloadContacts()
  }, [contactsAmount])

  return (
    <>
      <SearchSortField
        SearchProps={{
          value: $searchTerm,
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
            label: 'Oldest to newest',
            value: SortType.ASC,
          },
        ]}
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
          data={contactsLoaded ? contacts : new Array(10).fill(null)}
          columns={[
            {
              key: 'contact',
              label: 'Contact',
              render: (contact: Contact) => (
                <Flex alignItems="center">
                  <HexFishCircle
                    mr="1rem"
                    bg={accountGradientByOrder(contact.order)}
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
                      as: 'h5',
                      mr: '0.5rem',
                    }}
                    value={contact.address}
                    label={$getAddressLabel(contact.address)}
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
                            state: { address: contact?.address },
                          })
                        }
                      }}
                    >
                      <Button
                        leftIcon={
                          <Icon height={8}>
                            <SendIcon />
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
                  </Flex>
                )
              },
            },
            ACTIONS_COLUMN,
          ]}
        />
      )}
    </>
  )
}

const AddressBook: FC = () => {
  const [{ data: contacts, loaded }, addContact] = useAddressBook('')

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
            onAdd={(name, address) => addContact(name, address)}
          />
        </Flex>
      </Flex>
      <Box display={loaded ? 'block' : 'none'}>
        {contacts?.length === 0 ? (
          <EmptyOverview
            header="You don’t have any contacts"
            description="Your address book is where you can manage all of your contacts, their names, and their public addresses"
          />
        ) : (
          <ContactSearch contactsAmount={contacts?.length} />
        )}
      </Box>
    </>
  )
}

export default AddressBook
