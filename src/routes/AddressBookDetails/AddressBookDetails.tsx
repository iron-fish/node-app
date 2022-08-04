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
import { useParams } from 'react-router-dom'

import Send from 'Svgx/send'
import HexFishCircle from 'Components/HexFishCircle'
import BackButtonLink from 'Components/BackButtonLink'
import { truncateHash } from 'Utils/hash'
import { ROUTES } from '..'
import AddressBookTransactions from './AddressBookTransactions'

const getIconBg = (address = '') => {
  let colorNumber = 0
  Array.from(address).forEach(char => {
    colorNumber += char.charCodeAt(0)
  })

  return `hsl(${colorNumber % 255}, 100%, 73%)`
}

const AddressBookDetails = () => {
  const { address } = useParams()
  const $color = useColorModeValue(NAMED_COLORS.GREY, NAMED_COLORS.LIGHT_GREY)

  return (
    <Flex width="100%" height="100%" direction="column">
      <BackButtonLink
        mb="1rem"
        to={ROUTES.ADDRESS_BOOK}
        label={'Back to address book'}
      />
      <Flex mb="1rem" align="center">
        <HexFishCircle mr="1rem" bg={getIconBg('Frankie Boy')} />
        <chakra.h3 mr="1rem">{'Frankie Boy'}</chakra.h3>
        <CopyValueToClipboard
          containerProps={{
            color: $color,
          }}
          value={address}
          label={<chakra.h5>{truncateHash(address, 3)}</chakra.h5>}
          copyTooltipText="Copy to clipboard"
          copiedTooltipText="Copied"
        />
        <Button
          leftIcon={
            <Icon height={8}>
              <Send fill="currentColor" />
            </Icon>
          }
          ml="1.125rem"
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
