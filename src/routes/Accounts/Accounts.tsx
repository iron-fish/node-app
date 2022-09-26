import { FC, useState, useMemo } from 'react'
import {
  Box,
  Button,
  Flex,
  chakra,
  NAMED_COLORS,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
  Icon,
} from '@ironfish/ui-kit'
import IconAdd from '@ironfish/ui-kit/dist/svgx/icon-add'
import SearchSortField from 'Components/Search&Sort'
import useAccounts from 'Hooks/accounts/useAccounts'
import AccountPreview from 'Routes/Accounts/AccountPreview'
import ModalWindow from 'Components/ModalWindow'
import ImportAccount from 'Routes/Onboarding/ImportAccount'
import CreateAccount from 'Routes/Onboarding/CreateAccount'
import SortType from 'Types/SortType'

const DemoThreeDotsIcon: FC = () => (
  <Icon w={7} viewBox="0 0 28 28" style={{ marginBottom: 5, marginRight: 3 }}>
    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z" />
  </Icon>
)
interface ActionButtonsProps {
  showCreate: (show: boolean) => void
  showImport: (show: boolean) => void
}

const ActionButtons: FC<ActionButtonsProps> = ({ showCreate, showImport }) => {
  const buttons = useMemo(
    () => [
      {
        key: 'accounts-view-create',
        label: 'Create Account',
        onClick: () => showCreate(true),
      },
      {
        key: 'accounts-view-import',
        label: 'Import Account',
        onClick: () => showImport(true),
      },
    ],
    [showCreate, showImport]
  )
  const isGroup = useBreakpointValue({ base: true, sm2: false })
  return isGroup ? (
    <Menu>
      <MenuButton>
        <DemoThreeDotsIcon />
      </MenuButton>
      <MenuList>
        {buttons.map(({ key, label, onClick }) => (
          <MenuItem key={key} onClick={onClick}>
            {label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  ) : (
    <Flex gap="1rem">
      {buttons.map(({ key, label, onClick }) => (
        <Button
          key={key}
          leftIcon={<IconAdd mr="-0.25rem" />}
          borderRadius="4rem"
          variant="secondary"
          onClick={onClick}
        >
          <chakra.h5 mt="0.125rem">{label}</chakra.h5>
        </Button>
      ))}
    </Flex>
  )
}

const Accounts = () => {
  const [$searchTerm, $setSearchTerm] = useState('')
  const [$sortOrder, $setSortOrder] = useState<SortType>(SortType.ASC)
  const [{ data: accounts, loaded }, reloadAccounts] = useAccounts(
    $searchTerm,
    $sortOrder
  )
  const [showCreateAccount, setShowCreateAccount] = useState(false)
  const [showImportAccount, setShowImportAccount] = useState(false)
  const $colors = useColorModeValue(
    { subHeader: NAMED_COLORS.GREY },
    { subHeader: NAMED_COLORS.PALE_GREY }
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
            <h2>Privacy Accounts</h2>
          </Box>
          <Flex>
            <chakra.h5 color={$colors.subHeader}>
              Total accounts balance:
            </chakra.h5>
            &nbsp;
            <h5>
              <b>10,456 $IRON</b>
            </h5>
          </Flex>
        </Flex>
        <ActionButtons
          showCreate={setShowCreateAccount}
          showImport={setShowImportAccount}
        />
      </Flex>
      <SearchSortField
        SearchProps={{
          onChange: e => $setSearchTerm(e.target.value),
        }}
        SortSelectProps={{
          onSelectOption: ({ value }) => $setSortOrder(value),
        }}
      />
      <Flex mt="0.5rem" direction="column" width="100%">
        {loaded
          ? accounts.map((account, index) => (
              <AccountPreview
                key={`${account.name}-${index}`}
                {...account}
                order={index}
              />
            ))
          : null}
      </Flex>
      <ModalWindow
        isOpen={showCreateAccount}
        onClose={() => setShowCreateAccount(false)}
      >
        <CreateAccount
          desktopMode={false}
          onCreate={() => {
            setShowCreateAccount(false)
            reloadAccounts()
          }}
        />
      </ModalWindow>
      <ModalWindow
        isOpen={showImportAccount}
        onClose={() => setShowImportAccount(false)}
      >
        <ImportAccount
          desktopMode={false}
          onImport={() => {
            setShowImportAccount(false)
            reloadAccounts()
          }}
        />
      </ModalWindow>
    </>
  )
}

export default Accounts
