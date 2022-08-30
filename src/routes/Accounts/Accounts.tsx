import {
  Box,
  Button,
  Flex,
  chakra,
  NAMED_COLORS,
  useColorModeValue,
} from '@ironfish/ui-kit'
import IconAdd from '@ironfish/ui-kit/dist/svgx/icon-add'
import SearchSortField from 'Components/Search&Sort'
import { Link } from 'react-router-dom'
import AccountPreview from 'Routes/Accounts/AccountPreview'
import { ROUTES } from '..'

const DEMO_DATA = [
  {
    name: 'Primary Account',
    balance: 8.456,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Secondary Account',
    balance: 1.944,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 3',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 4',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 5',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 6',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 7',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 8',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 9',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 10',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 11',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
  {
    name: 'Account 12',
    balance: 56,
    address: '456tenft893ntw5v780ntq304wnv5t370q8nt553d5',
  },
]

const Accounts = () => {
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
        <Flex>
          <Button
            leftIcon={<IconAdd mr="-0.25rem" />}
            mr="1rem"
            borderRadius="4rem"
            variant="secondary"
            as={Link}
            to={ROUTES.CREATE}
          >
            <chakra.h5 mt="2px">Create Account</chakra.h5>
          </Button>
          <Button
            leftIcon={<IconAdd mr="-0.25rem" />}
            borderRadius="4rem"
            variant="secondary"
            as={Link}
            to={ROUTES.IMPORT}
          >
            <chakra.h5 mt="2px">Import Account</chakra.h5>
          </Button>
        </Flex>
      </Flex>
      <SearchSortField />
      <Flex mt="0.5rem" direction="column" width="100%">
        {DEMO_DATA.map((data, index) => (
          <AccountPreview {...data} order={index} />
        ))}
      </Flex>
    </>
  )
}

export default Accounts
