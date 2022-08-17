import { FC } from 'react'
import {
  Box,
  Button,
  Flex,
  HexFish,
  Icon,
  IconButton,
  NAMED_COLORS,
  chakra,
} from '@ironfish/ui-kit'
import Send from 'Svgx/send'
import Receive from 'Svgx/receive'
import Caret from 'Svgx/caret-icon'
import { Link } from 'react-router-dom'
import { ROUTES } from '..'

export interface AccountPreviewProps {
  order: number
  name: string
  balance: number
  address: string
}

const ORDER_COLOR = [
  {
    from: '#85ADFD',
    to: '#4B87FF',
  },
  {
    from: '#FFE2B9',
    to: '#FFCD85',
  },
  {
    from: '#FFD7F0',
    to: '#FFC2E8',
  },
  {
    from: '#FFF698',
    to: '#FFEC1F',
  },
  {
    from: '#FF9A7A',
    to: '#F15929',
  },
  {
    from: '#53C025',
    to: '#389810',
  },
  {
    from: '#FFF4E0',
    to: '#FFEBC7',
  },
  {
    from: '#DEFFFE',
    to: '#B9FAF8',
  },
  {
    from: '#C8C8C8',
    to: '#878E88',
  },
  {
    from: '#E1AF8F',
    to: '#B17A57',
  },
  {
    from: '#FF86B8',
    to: '#ED5292',
  },
  {
    from: '#B0A78C',
    to: '#756D54',
  },
]

const AccountPreview: FC<AccountPreviewProps> = ({
  order = 0,
  name,
  balance = 0,
  address,
}) => (
  <Flex
    p="0.75rem"
    my="0.5rem"
    border="0.063rem solid"
    borderColor={NAMED_COLORS.LIGHT_GREY}
    borderRadius="0.25rem"
    cursor="pointer"
    as={Link}
    to={ROUTES.ACCOUNT}
    state={{ accountId: address }}
    sx={{
      transition: '0.3s',
      bg: NAMED_COLORS.WHITE,
      borderColor: NAMED_COLORS.LIGHT_GREY,
      '.chakra-ui-dark &': {
        bg: NAMED_COLORS.DARKER_GREY,
        borderColor: NAMED_COLORS.DARK_GREY,
      },
      boxShadow: '0px 0.25rem 0.6875rem rgba(0, 0, 0, 0.04)',
      zIndex: 0,
    }}
  >
    <Flex
      w={{ base: '6rem', md: '10.375rem' }}
      h="6rem"
      mr={{
        base: '1.25rem',
        sm: '1.25rem',
        lg: '2.75rem',
      }}
      bg={`linear-gradient(89.56deg, ${
        ORDER_COLOR[order % ORDER_COLOR.length].from
      } 0.38%, ${ORDER_COLOR[order % ORDER_COLOR.length].to} 99.64%)`}
      borderColor={NAMED_COLORS.BLACK}
      borderRadius="0.25rem"
      border="0.063rem solid"
      float="right"
      alignItems="center"
      justifyContent="center"
      _before={{
        w: { base: '6rem', md: '10.375rem' },
        h: '6rem',
        position: 'absolute',
        content: `""`,
        borderColor: NAMED_COLORS.BLACK,
        borderRadius: '0.25rem',
        border: '0.063rem solid',
        bg: `linear-gradient(89.56deg, ${NAMED_COLORS.WHITE} 0.38%, ${
          ORDER_COLOR[order % ORDER_COLOR.length].to
        } 99.64%)`,
        mr: '-0.25rem',
        mb: '-0.25rem',
        mt: '0.25rem',
        ml: '0.25rem',
        zIndex: -1,
      }}
    >
      <HexFish style={{ height: '2rem' }} />
    </Flex>
    <Box>
      <h5>{name}</h5>
      <chakra.h3 p="4px 0">{balance} $IRON</chakra.h3>
      <h5 style={{ color: NAMED_COLORS.GREY }}>{address}</h5>
    </Box>
    <Flex ml="auto" alignSelf="center">
      <Flex direction="column" gap="0.75rem">
        <Button
          variant="primary"
          borderRadius="4rem"
          mr="1rem"
          onClick={e => {
            // required to prevent triggering card click event
            e.stopPropagation()
          }}
          leftIcon={
            <Icon height={8}>
              <Send fill="currentColor" />
            </Icon>
          }
        >
          <h5>Send</h5>
        </Button>
        <Button
          variant="primary"
          borderRadius="4rem"
          mr="1rem"
          onClick={e => {
            // required to prevent triggering card click event
            e.stopPropagation()
          }}
          leftIcon={
            <Icon height={8}>
              <Receive fill="currentColor" />
            </Icon>
          }
        >
          <h5>Receive</h5>
        </Button>
      </Flex>
      <IconButton
        alignSelf="center"
        aria-label="account-details"
        variant="ghost"
        icon={<Caret />}
      />
    </Flex>
  </Flex>
)
export default AccountPreview
