import {
  Box,
  Button,
  Flex,
  IconSearch,
  SearchAutocomplete,
  SelectField,
} from '@ironfish/ui-kit'
import IconAdd from '@ironfish/ui-kit/dist/svgx/icon-add'
import Account from 'Components/Account'

const DEMO_DATA = [
  {
    name: 'Primary Account',
    balance: 8.456,
    address: '456t...543d...53d5',
  },
  {
    name: 'Secondary Account',
    balance: 1.944,
    address: '456t...543d...53d5',
  },
  {
    name: 'Account 3',
    balance: 56,
    address: '456t...543d...53d5',
  },
  {
    name: 'Account 4',
    balance: 56,
    address: '456t...543d...53d5',
  },
  {
    name: 'Account 5',
    balance: 56,
    address: '456t...543d...53d5',
  },
  {
    name: 'Account 6',
    balance: 56,
    address: '456t...543d...53d5',
  },
  {
    name: 'Account 7',
    balance: 56,
    address: '456t...543d...53d5',
  },
  {
    name: 'Account 8',
    balance: 56,
    address: '456t...543d...53d5',
  },
  {
    name: 'Account 9',
    balance: 56,
    address: '456t...543d...53d5',
  },
  {
    name: 'Account 10',
    balance: 56,
    address: '456t...543d...53d5',
  },
  {
    name: 'Account 11',
    balance: 56,
    address: '456t...543d...53d5',
  },
  {
    name: 'Account 12',
    balance: 56,
    address: '456t...543d...53d5',
  },
]

const Accounts = () => {
  return (
    <Flex
      width="100%"
      height="100%"
      justifyContent="center"
      px="2rem"
      py="2.5rem"
    >
      <Box width="100%" height="100%" maxWidth="65.5rem">
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
                Total accounts balance: <b>10,456 $IRON</b> USD $10.456
              </h5>
            </Box>
          </Flex>
          <Flex>
            <Button
              leftIcon={<IconAdd />}
              mr="1rem"
              borderRadius="4rem"
              variant="secondary"
            >
              Create Account
            </Button>
            <Button
              leftIcon={<IconAdd />}
              borderRadius="4rem"
              variant="secondary"
            >
              Import Account
            </Button>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" w="100%" alignItems="center">
          <SearchAutocomplete<string>
            getOptionLabel={option => option}
            InputProps={{ mr: '1rem', placeholder: 'Search' }}
            inputLeftElement={<IconSearch />}
          />
          <SelectField
            label="Sort by"
            minWidth="15rem"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            size="small"
            options={[
              {
                label: 'Highest to lowest balance',
                value: 'desc',
              },
              {
                label: 'Lowest to highest balance',
                value: 'asc',
              },
            ]}
            whiteSpace="nowrap"
          />
        </Flex>
        <Flex direction="column" width="100%">
          {DEMO_DATA.map((data, index) => (
            <Account {...data} order={index} />
          ))}
        </Flex>
      </Box>
    </Flex>
  )
}

export default Accounts
