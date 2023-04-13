import { FC } from 'react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { NAMED_COLORS, Link, LinkProps, Flex } from '@ironfish/ui-kit'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom'

interface BackButtonLinkProps
  extends LinkProps,
    Omit<RouterLinkProps, 'color'> {
  label: string
}

const BackButtonLink: FC<BackButtonLinkProps> = ({ label, ...rest }) => {
  return (
    <Link
      display="flex"
      w="max-content"
      alignItems="center"
      cursor="pointer"
      as={RouterLink}
      {...rest}
      _hover={{
        color: NAMED_COLORS.DEEP_BLUE,
        _dark: {
          color: NAMED_COLORS.WHITE,
        },
        ':hover>div': {
          borderColor: NAMED_COLORS.DEEP_BLUE,
          _dark: {
            borderColor: NAMED_COLORS.WHITE,
          },
          background: NAMED_COLORS.WHITE,
          '.chakra-icon': {
            color: NAMED_COLORS.BLACK,
          },
        },
      }}
    >
      <Flex
        borderRadius="50%"
        mr="0.625rem"
        w="1.5rem"
        h="1.5rem"
        border={`0.0625rem solid ${NAMED_COLORS.LIGHT_GREY}`}
        _dark={{
          border: `0.0625rem solid ${NAMED_COLORS.GREY}`,
        }}
        justifyContent="center"
        alignItems="center"
      >
        <ChevronLeftIcon
          w="1rem"
          h="1rem"
          color={NAMED_COLORS.BLACK}
          _dark={{
            color: NAMED_COLORS.WHITE,
          }}
        />
      </Flex>
      <h5>{label}</h5>
    </Link>
  )
}

export default BackButtonLink
