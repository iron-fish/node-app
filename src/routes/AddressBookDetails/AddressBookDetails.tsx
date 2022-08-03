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
  Link,
} from '@ironfish/ui-kit'
import AddressBookTransactions from './AddressBookTransactions'
import Send from 'Svgx/send'
import HexFishCircle from 'Components/HexFishCircle'
import { CaretInCircle } from 'Svgx/caret-in-circle-icon'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '..'
import { truncateHash } from 'Utils/hash'

const getIconBg = (address = '') => {
  let colorNumber = 0
  Array.from(address).forEach(char => {
    colorNumber += char.charCodeAt(0)
  })

  return `hsl(${colorNumber % 255}, 100%, 73%)`
}

const AddressBookDetails = () => {
  const { address } = useParams()

  return (
    <Flex width="100%" height="100%" direction="column">
      <Link
        display={'flex'}
        mb="1rem"
        alignItems="center"
        cursor="pointer"
        as={RouterLink}
        to={ROUTES.ADDRESS_BOOK}
      >
        <CaretInCircle mr="0.75rem" />
        Back to address book
      </Link>
      <Flex mb="1rem" align="center">
        <HexFishCircle mr="1rem" bg={getIconBg('Frankie Boy')} />
        <chakra.h3 mr="1rem">{'Frankie Boy'}</chakra.h3>
        <CopyValueToClipboard
          labelProps={{
            color: NAMED_COLORS.GREY,
          }}
          iconButtonProps={{
            color: NAMED_COLORS.GREY,
            'aria-label': 'icon',
          }}
          value={address}
          label={truncateHash(address)}
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
            <AddressBookTransactions />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

export default AddressBookDetails
