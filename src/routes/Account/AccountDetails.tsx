import {
  Flex,
  chakra,
  CopyValueToClipboard,
  NAMED_COLORS,
  TabPanels,
  TabPanel,
  Tabs,
  TabList,
  Tab,
} from '@ironfish/ui-kit'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '..'
import { truncateHash } from 'Utils/hash'
import LocationStateProps from 'Types/LocationState'
import AccountOverview from './Overview/Overview'
import AccountKeys from './Keys/Keys'
import BackButtonLink from 'Components/BackButtonLink'
import useAccount from 'Hooks/accounts/useAccount'
import AccountSettings from './Settings/Settings'
import { Container } from './Shared/Container'
import { ViewOnlyChip } from 'Components/ViewOnlyChip/ViewOnlyChip'

export default function AccountDetails() {
  const location = useLocation()
  const { accountId } = location.state as LocationStateProps
  const {
    data: account,
    loaded,
    actions: { exportAccount, updateAccount, deleteAccount },
  } = useAccount(accountId)
  return (
    <Flex flexDirection="column" pb="0" bg="transparent" w="100%" h="100%">
      <Container>
        <BackButtonLink
          mb="1rem"
          to={ROUTES.ACCOUNTS}
          label={'Back to all accounts'}
        />
      </Container>
      {loaded && (
        <>
          <Container display="flex" alignItems="center" mb="0.5rem" gap={3}>
            <chakra.h2 pb="0.15rem">{account.name}</chakra.h2>
            {account.viewOnly && <ViewOnlyChip />}
            <CopyValueToClipboard
              label={truncateHash(account?.publicAddress, 3)}
              labelProps={{
                as: 'h5',
              }}
              value={account.publicAddress}
              copyTooltipText="Copy to clipboard"
              copiedTooltipText="Copied"
              containerProps={{
                color: NAMED_COLORS.GREY,
                _dark: {
                  color: NAMED_COLORS.PALE_GREY,
                },
              }}
            />
          </Container>
          <Tabs flexGrow={1} display="flex" flexDirection="column">
            <TabList as={Container}>
              <Tab>
                <chakra.h6>Account Overview</chakra.h6>
              </Tab>
              <Tab>
                <chakra.h6>Keys</chakra.h6>
              </Tab>
              <Tab>
                <chakra.h6>Settings</chakra.h6>
              </Tab>
            </TabList>
            <TabPanels flexGrow={1} display="flex" alignItems="stretch">
              <TabPanel p="0" flexGrow={1} display="flex" alignItems="stretch">
                <AccountOverview account={account} />
              </TabPanel>
              <TabPanel as={Container} p="0" pt="2rem">
                <AccountKeys account={account} exportAccount={exportAccount} />
              </TabPanel>
              <TabPanel as={Container} p="0" pt="2rem">
                <AccountSettings
                  account={account}
                  updateAccount={updateAccount}
                  deleteAccount={deleteAccount}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </Flex>
  )
}
