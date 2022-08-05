import { FC } from 'react'
import {
  Box,
  Button,
  CommonTable,
  Flex,
  Icon,
  IconButton,
  IconSearch,
  SelectField,
  chakra,
  InputGroup,
  InputLeftElement,
  Input,
} from '@ironfish/ui-kit'
import { Link } from 'react-router-dom'
import IconAdd from '@ironfish/ui-kit/dist/svgx/icon-add'
import Send from 'Svgx/send'
import Caret from 'Svgx/caret-icon'
import HexFishCircle from 'Components/HexFishCircle'

const getIconBg = (address = '') => {
  let colorNumber = 0
  Array.from(address).forEach(char => {
    colorNumber += char.charCodeAt(0)
  })

  return `hsl(${colorNumber % 255}, 100%, 73%)`
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
      <CommonTable
        data={DEMO_DATA}
        columns={[
          {
            key: 'contact',
            label: 'Contact',
            render: address => (
              <Flex alignItems="center">
                <HexFishCircle
                  mr="1rem"
                  bg={getIconBg(address.address + address.name)}
                />
                <Box>{address.name}</Box>
              </Flex>
            ),
          },
          {
            key: 'address',
            label: 'Address',
            render: address => (
              <Box
                whiteSpace="nowrap"
                maxWidth="30vw"
                sx={{
                  '> span': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    verticalAlign: 'middle',
                  },
                }}
              >
                <chakra.span
                  display="inline-block"
                  textOverflow="ellipsis"
                  width="calc(50% - 0.2rem)"
                >
                  {address.address?.slice(0, address.address?.length / 2)}
                </chakra.span>
                <chakra.span
                  display="inline-flex"
                  width="calc(50% + 0.2rem)"
                  justifyContent="flex-end"
                >
                  {address.address?.slice(
                    address.address?.length / 2,
                    address.address?.length
                  )}
                </chakra.span>
              </Box>
            ),
          },
          {
            key: 'actions',
            label: '',
            WrapperProps: {
              width: '13.2rem',
            },
            render: address => (
              <Flex>
                <Button
                  leftIcon={
                    <Icon height={8}>
                      <Send fill="currentColor" />
                    </Icon>
                  }
                  variant="primary"
                  borderRadius="4rem"
                  mr="1rem"
                >
                  Send
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
        ]}
      />
    </Flex>
  </>
)

export default AddressBook
