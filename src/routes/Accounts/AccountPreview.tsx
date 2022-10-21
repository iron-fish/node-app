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
  CopyValueToClipboard,
  useColorModeValue,
} from '@ironfish/ui-kit'
import Send from 'Svgx/send'
import Receive from 'Svgx/receive'
import Caret from 'Svgx/caret-icon'
import { useNavigate } from 'react-router-dom'
import { truncateHash } from 'Utils/hash'
import { ROUTES } from '..'
import CutAccount from 'Types/CutAccount'
import AccountBalance from 'Components/AccountBalance'
import { useDataSync } from 'Providers/DataSyncProvider'

export interface AccountPreviewProps extends CutAccount {
  order: number
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
  publicAddress,
  id,
}) => {
  const navigate = useNavigate()
  const { loaded } = useDataSync()
  const $colors = useColorModeValue(
    {
      bg: NAMED_COLORS.WHITE,
      borderColor: NAMED_COLORS.LIGHT_GREY,
      hoverBorder: NAMED_COLORS.DEEP_BLUE,
      caretColor: NAMED_COLORS.PALE_GREY,
    },
    {
      bg: NAMED_COLORS.DARKER_GREY,
      borderColor: NAMED_COLORS.DARK_GREY,
      hoverBorder: NAMED_COLORS.WHITE,
      caretColor: NAMED_COLORS.PALE_GREY,
    }
  )
  return (
    <Flex
      p="0.75rem 2rem 0.75rem 0.75rem"
      my="0.5rem"
      border="0.063rem solid"
      borderRadius="0.25rem"
      cursor="pointer"
      onClick={() => navigate(ROUTES.ACCOUNT, { state: { accountId: id } })}
      sx={{
        transition: '0.3s',
        bg: $colors.bg,
        borderColor: $colors.borderColor,
        boxShadow: '0 0.25rem 0.6875rem rgba(0, 0, 0, 0.04)',
        '[aria-label="account-details"]': {
          color: $colors.caretColor,
        },
        _hover: {
          '[aria-label="account-details"]': {
            color: $colors.hoverBorder,
          },
          borderColor: $colors.hoverBorder,
        },
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
        <chakra.h5 pt="0.25rem">{name}</chakra.h5>
        <chakra.h3 p="0.25rem 0">
          <AccountBalance accountId={id} />
        </chakra.h3>
        <CopyValueToClipboard
          containerProps={{
            color: NAMED_COLORS.GREY,
          }}
          iconButtonProps={{
            justifyContent: 'none',
            minW: '0.75rem',
          }}
          labelProps={{
            as: 'h5',
            mr: '0.5rem',
          }}
          value={publicAddress}
          label={truncateHash(publicAddress, 3)}
          copyTooltipText="Copy to clipboard"
          copiedTooltipText="Copied"
        />
      </Box>
      <Flex ml="auto" alignSelf="center" mr="-1rem">
        <Flex direction="column" gap="0.75rem">
          <Button
            variant="primary"
            borderRadius="4rem"
            mr="1rem"
            onClick={e => {
              // required to prevent triggering card click event
              e.stopPropagation()
              navigate(ROUTES.SEND, { state: { accountId: id } })
            }}
            leftIcon={
              <Icon height={8}>
                <Send fill="currentColor" />
              </Icon>
            }
            isDisabled={!loaded}
            disabled={!loaded}
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
              navigate(ROUTES.RECEIVE, { state: { accountId: id } })
            }}
            leftIcon={
              <Icon height={8}>
                <Receive fill="currentColor" />
              </Icon>
            }
            isDisabled={!loaded}
            disabled={!loaded}
          >
            <h5>Receive</h5>
          </Button>
        </Flex>
        <IconButton
          alignSelf="center"
          aria-label="account-details"
          variant="ghost"
          _active={{ bg: 'none' }}
          _hover={{ bg: 'none' }}
          icon={<Caret />}
        />
      </Flex>
    </Flex>
  )
}

export default AccountPreview
