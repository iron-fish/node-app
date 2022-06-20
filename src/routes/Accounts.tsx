import { Box, Flex } from '@ironfish/ui-kit'
import Account from 'src/components/Account'

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
    <Box width="100%" height="100%">
      <Flex direction="column" width="100%">
        {DEMO_DATA.map((data, index) => (
          <Account {...data} order={index} />
        ))}
      </Flex>
    </Box>
  )
}

export default Accounts
