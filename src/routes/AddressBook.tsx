import { FC } from 'react'
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  chakra,
  NAMED_COLORS,
  CopyValueToClipboard,
  useBreakpointValue,
  useColorModeValue,
} from '@ironfish/ui-kit'
import { Link } from 'react-router-dom'
import IconAdd from '@ironfish/ui-kit/dist/svgx/icon-add'
import Send from 'Svgx/send'
import Caret from 'Svgx/caret-icon'
import HexFishCircle from 'Components/HexFishCircle'
import { truncateHash } from 'Utils/hash'
import SimpleTable from 'Components/SimpleTable'
import SearchSortField from 'Components/Search&Sort'

const getIconBg = (address = '') => {
  let colorNumber = 0
  Array.from(address).forEach(char => {
    colorNumber += char.charCodeAt(0)
  })

  return `hsl(${colorNumber % 255}, 100%, 73%)`
}

interface BookDemoDataType {
  name: string
  address: string
}

const DEMO_DATA = [
  {
    name: 'Frankie Boy',
    address: '789wenft893ntw5v780ntq304wnv5t370q8nt5q340',
  },
  {
    name: 'Tweetie',
    address: '789wenft893ntw5v780ntq304wnv5t370q8nt5q340',
  },
  {
    name: 'Rox1923',
    address: '789wenft893ntw5v780ntq304wnv5t370q8nt5q340',
  },
  {
    name: 'Alfred A',
    address: '789wenft893ntw5v780ntq304wnv5t370q8nt5q340',
  },
  {
    name: 'Derek',
    address: '789wenft893ntw5v780ntq304wnv5t370q8nt5q340',
  },
  {
    name: 'Jason',
    address: '789wenft893ntw5v780ntq304wnv5t370q8nt5q340',
  },
]

const COLUMNS = [
  {
    key: 'contact',
    label: 'Contact',
    render: (address: BookDemoDataType) => (
      <Flex alignItems="center">
        <HexFishCircle
          mr="1rem"
          bg={getIconBg(address.address + address.name)}
        />
        <h5>{address.name}</h5>
      </Flex>
    ),
  },
  {
    key: 'address',
    label: 'Address',
    render: (address: BookDemoDataType) => {
      const addressLabel = useBreakpointValue({
        base: truncateHash(address.address, 2, 9),
        md: address.address,
      })
      return (
        <CopyValueToClipboard
          iconButtonProps={{
            justifyContent: 'none',
            minW: '0.75rem',
            color: NAMED_COLORS.GREY,
          }}
          labelProps={{
            mr: '0.5rem',
          }}
          value={address.address}
          label={<chakra.h5>{addressLabel}</chakra.h5>}
          copyTooltipText="Copy to clipboard"
          copiedTooltipText="Copied"
        />
      )
    },
  },
  {
    key: 'actions',
    label: '',
    render: (address: BookDemoDataType) => (
      <Flex justify="flex-end" mr="-1.0625rem">
        <Button
          leftIcon={
            <Icon height={8}>
              <Send fill="currentColor" />
            </Icon>
          }
          variant="primary"
          borderRadius="4rem"
          mr={{ base: '0.75rem', md: '1rem' }}
        >
          <h5>Send</h5>
        </Button>
        <IconButton
          aria-label="book-details"
          variant="ghost"
          icon={<Caret />}
          as={Link}
          to={address.address}
          _active={{ bg: 'none' }}
          _hover={{ bg: 'none' }}
        />
      </Flex>
    ),
  },
]

const AddressBook: FC = () => {
  const $colors = useColorModeValue(
    {
      hoverBorder: NAMED_COLORS.DEEP_BLUE,
      caretColor: NAMED_COLORS.PALE_GREY,
    },
    {
      hoverBorder: NAMED_COLORS.WHITE,
      caretColor: NAMED_COLORS.PALE_GREY,
    }
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
            <h2>Address Book</h2>
          </Box>
        </Flex>
        <Flex>
          <Button
            leftIcon={<IconAdd />}
            borderRadius="4rem"
            variant="secondary"
          >
            <h5>Add Contact</h5>
          </Button>
        </Flex>
      </Flex>
      <SearchSortField />
      <Flex direction="column" width="100%">
        <SimpleTable
          data={DEMO_DATA}
          columns={COLUMNS}
          sx={{
            tr: {
              '[aria-label="book-details"]': {
                color: $colors.caretColor,
              },
              _hover: {
                '[aria-label="book-details"]': {
                  color: $colors.hoverBorder,
                },
              },
            },
          }}
        />
      </Flex>
    </>
  )
}

export default AddressBook
