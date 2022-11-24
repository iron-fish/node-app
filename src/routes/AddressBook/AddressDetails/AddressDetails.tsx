import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  chakra,
  CopyValueToClipboard,
  Button,
  Icon,
  NAMED_COLORS,
  useColorModeValue,
} from '@ironfish/ui-kit'
import { useParams, useNavigate } from 'react-router-dom'

import Send from 'Svgx/send'
import HexFishCircle from 'Components/HexFishCircle'
import BackButtonLink from 'Components/BackButtonLink'
import { truncateHash } from 'Utils/hash'
import AddressTransactions from './AddressTransactions'
import ContactSettings from './ContactSettings'
import useContact from 'Hooks/addressBook/useContact'
import ROUTES from 'Routes/data'
import { useDataSync } from 'Providers/DataSyncProvider'
import { stringToColor } from 'Utils/stringToColor'

const AddressDetails = () => {
  const { identity } = useParams()
  const navigate = useNavigate()
  const $color = useColorModeValue(NAMED_COLORS.GREY, NAMED_COLORS.LIGHT_GREY)
  const [{ data: contact, loaded }, updateContact, deleteContact] =
    useContact(identity)
  const { loaded: synced } = useDataSync()

  return (
    <Flex width="100%" height="100%" direction="column">
      <BackButtonLink
        mb="1rem"
        to={ROUTES.ADDRESS_BOOK}
        label={'Back to address book'}
      />
      <Flex mb="0.5rem" align="center">
        <HexFishCircle mr="1rem" bg={stringToColor(identity, 73)} />
        <chakra.h3 mr="1rem">{contact?.name}</chakra.h3>
        <CopyValueToClipboard
          containerProps={{
            color: $color,
          }}
          iconButtonProps={{
            justifyContent: 'none',
            minW: '0.75rem',
          }}
          labelProps={{
            mr: '0.5rem',
            as: 'h5',
          }}
          value={contact?.address}
          label={truncateHash(contact?.address, 3)}
          copyTooltipText="Copy to clipboard"
          copiedTooltipText="Copied"
        />
        <Button
          leftIcon={
            <Icon height={8}>
              <Send fill="currentColor" />
            </Icon>
          }
          ml="2rem"
          variant="primary"
          size="small"
          onClick={() => {
            navigate(ROUTES.SEND, { state: { address: contact?.address } })
          }}
          isDisabled={!synced}
          disabled={!synced}
        >
          Send
        </Button>
      </Flex>
      <Tabs>
        <TabList>
          <Tab>Transactions</Tab>
          <Tab>Contact Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel pl="0rem">
            <AddressTransactions address={contact?.address} />
          </TabPanel>
          <TabPanel p="0rem">
            <ContactSettings
              contact={contact}
              onUpdate={updateContact}
              onDelete={deleteContact}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

export default AddressDetails
