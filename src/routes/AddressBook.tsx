import { FC } from 'react'
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  IconSearch,
  SelectField,
  chakra,
  InputGroup,
  InputLeftElement,
  Input,
  NAMED_COLORS,
  CopyValueToClipboard,
  useBreakpointValue,
} from '@ironfish/ui-kit'
import { Link } from 'react-router-dom'
import IconAdd from '@ironfish/ui-kit/dist/svgx/icon-add'
import Send from 'Svgx/send'
import Caret from 'Svgx/caret-icon'
import HexFishCircle from 'Components/HexFishCircle'
import { truncateHash } from 'Utils/hash'
import SimpleTable from 'Components/SimpleTable'

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
            'aria-label': 'copy',
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
    WrapperProps: {
      width: '13.2rem',
    },
    render: (address: BookDemoDataType) => (
      <Flex>
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
          aria-label="account-details"
          variant="ghost"
          icon={<Caret />}
          as={Link}
          to={address.address}
        />
      </Flex>
    ),
  },
]

const AddressBook: FC = () => (
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
        <Button leftIcon={<IconAdd />} borderRadius="4rem" variant="secondary">
          Import Account
        </Button>
      </Flex>
    </Flex>
    <Flex justifyContent="space-between" w="100%" alignItems="center">
      <InputGroup variant="search" mr="1rem">
        <InputLeftElement pointerEvents="none">
          <IconSearch />
        </InputLeftElement>
        <Input placeholder="Search" />
      </InputGroup>
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
      <SimpleTable
        data={DEMO_DATA}
        columns={COLUMNS}
        textTransform="capitalize"
      />
    </Flex>
  </>
)

export default AddressBook
