import { useState } from 'react'
import { Box, Button, Flex } from '@ironfish/ui-kit'
import IconAdd from '@ironfish/ui-kit/dist/svgx/icon-add'
import SearchSortField from 'Components/Search&Sort'
import useAccounts from 'Hooks/accounts/useAccounts'
import { Link } from 'react-router-dom'
import AccountPreview from 'Routes/Accounts/AccountPreview'
import { ROUTES } from '..'

const Accounts = () => {
  const [$searchTerm, $setSearchTerm] = useState('')
  const [$sortOrder, $setSortOrder] = useState('asc')
  const { data: accounts, loaded } = useAccounts($searchTerm)
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
          <Box>
            <h5>
              Total accounts balance: <b>10,456 $IRON</b>
            </h5>
          </Box>
        </Flex>
        <Flex>
          <Button
            leftIcon={<IconAdd mr="-0.25rem" />}
            mr="1rem"
            borderRadius="4rem"
            variant="secondary"
            as={Link}
            to={ROUTES.CREATE}
          >
            Create Account
          </Button>
          <Button
            leftIcon={<IconAdd mr="-0.25rem" />}
            borderRadius="4rem"
            variant="secondary"
            as={Link}
            to={ROUTES.IMPORT}
          >
            Import Account
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
        {loaded
          ? accounts.map((data, index) => (
              <AccountPreview
                key={`${data.name}-${index}`}
                {...data}
                order={index}
              />
            ))
          : null}
      </Flex>
    </>
  )
}

export default Accounts
