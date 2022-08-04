import { FC } from 'react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import {
  NAMED_COLORS,
  useColorModeValue,
  Link,
  LinkProps,
} from '@ironfish/ui-kit'
import { Link as RouterLink } from 'react-router-dom'

interface BackButtonLinkProps extends LinkProps {
  label: string
  to: string
}

const BackButtonLink: FC<BackButtonLinkProps> = ({ to, label, ...rest }) => {
  const $colors = useColorModeValue(
    {
      chevron: NAMED_COLORS.BLACK,
      chevronBorder: `0.0625rem solid ${NAMED_COLORS.LIGHT_GREY}`,
      chevronHoverBorder: NAMED_COLORS.DEEP_BLUE,
      linkHover: NAMED_COLORS.DEEP_BLUE,
    },
    {
      chevron: NAMED_COLORS.WHITE,
      chevronBorder: `0.0625rem solid ${NAMED_COLORS.GREY}`,
      chevronHoverBorder: NAMED_COLORS.WHITE,
      linkHover: NAMED_COLORS.WHITE,
    }
  )
  return (
    <Link
      display={'flex'}
      alignItems="center"
      cursor="pointer"
      as={RouterLink}
      to={to}
      {...rest}
      _hover={{
        color: $colors.linkHover,
        ':hover>.chakra-icon': {
          color: NAMED_COLORS.BLACK,
          borderColor: $colors.chevronHoverBorder,
          background: NAMED_COLORS.WHITE,
        },
      }}
    >
      <ChevronLeftIcon
        mr="0.625rem"
        w="24px"
        h="24px"
        border={$colors.chevronBorder}
        borderRadius="50%"
        color={$colors.chevron}
      />
      {label}
    </Link>
  )
}

export default BackButtonLink
