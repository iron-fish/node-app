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
} from '@ironfish/ui-kit'
import { useParams, useNavigate } from 'react-router-dom'

import SendIcon from 'Svgx/send'
import HexFishCircle from 'Components/HexFishCircle'
import BackButtonLink from 'Components/BackButtonLink'
import { truncateHash } from 'Utils/hash'
import AddressTransactions from './AddressTransactions'
import ContactSettings from './ContactSettings'
import useContact from 'Hooks/addressBook/useContact'
import ROUTES from 'Routes/data'
import { useDataSync } from 'Providers/DataSyncProvider'
import { accountGradientByOrder } from 'Utils/accountGradientByOrder'

const SendButton = ({ address }: { address: string }) => {
  const navigate = useNavigate()
  const { synced } = useDataSync()
  return (
    <Button
      leftIcon={
        <Icon height={8}>
          <SendIcon />
        </Icon>
      }
      ml="2rem"
      variant="primary"
      size="small"
      onClick={() => {
        navigate(ROUTES.SEND, { state: { address } })
      }}
      isDisabled={!synced}
      disabled={!synced}
    >
      Send
    </Button>
  )
}

const AddressDetails = () => {
  const { identity } = useParams()
  const [{ data: contact }, updateContact, deleteContact] = useContact(identity)

  return (
    <Flex width="100%" height="100%" direction="column">
      <BackButtonLink
        mb="1rem"
        to={ROUTES.ADDRESS_BOOK}
        label={'Back to address book'}
      />
      <Flex mb="0.5rem" align="center">
        <HexFishCircle
          mr="1rem"
          bg={contact ? accountGradientByOrder(contact.order) : 'white'}
          isAnimated={!contact}
        />
        <chakra.h3 mr="1rem">{contact?.name}</chakra.h3>
        <CopyValueToClipboard
          containerProps={{
            color: NAMED_COLORS.GREY,
            _dark: {
              color: NAMED_COLORS.PALE_GREY,
            },
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
        <SendButton address={contact?.address} />
      </Flex>
      <Tabs>
        <TabList>
          <Tab>
            <chakra.h6>Transactions</chakra.h6>
          </Tab>
          <Tab>
            <chakra.h6>Contact Settings</chakra.h6>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel pl="0rem">
            <AddressTransactions address={contact?.address} contact={contact} />
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
