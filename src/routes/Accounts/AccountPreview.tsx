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
import { Account } from 'Data/types/Account'
import { useDataSync } from 'Providers/DataSyncProvider'
import { stringToColor } from 'Utils/stringToColor'

const AccountPreview: FC<Account> = ({
  name,
  balance = 0,
  address,
  identity,
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
      onClick={() =>
        navigate(ROUTES.ACCOUNT, { state: { accountId: identity } })
      }
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
        bg={`linear-gradient(89.56deg, ${stringToColor(
          identity,
          85
        )} 0.38%, ${stringToColor(identity, 55)} 99.64%)`}
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
          bg: `linear-gradient(89.56deg, ${
            NAMED_COLORS.WHITE
          } 0.38%, ${stringToColor(identity, 55)} 99.64%)`,
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
        <chakra.h3 p="0.25rem 0">{balance} $IRON</chakra.h3>
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
          value={address}
          label={truncateHash(address, 3)}
          copyTooltipText="Copy to clipboard"
          copiedTooltipText="Copied"
        />
      </Box>
      <Flex ml="auto" alignSelf="center" mr="-1rem">
        <Flex direction="column" gap="0.75rem">
          <Flex
            onClick={e => {
              // required to prevent triggering card click event
              e.stopPropagation()
              if (loaded) {
                navigate(ROUTES.SEND, { state: { accountId: identity } })
              }
            }}
          >
            <Button
              w="100%"
              variant="primary"
              borderRadius="4rem"
              mr="1rem"
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
          </Flex>
          <Flex
            onClick={e => {
              // required to prevent triggering card click event
              e.stopPropagation()
              if (loaded) {
                navigate(ROUTES.RECEIVE, { state: { accountId: identity } })
              }
            }}
          >
            <Button
              w="100%"
              variant="primary"
              borderRadius="4rem"
              mr="1rem"
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
