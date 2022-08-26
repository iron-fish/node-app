import { IconProps, useColorModeValue } from '@ironfish/ui-kit'
import AccountKeysImageDark from './AccountKeysImageDark'
import AccountKeysImageLight from './AccountKeysImageLight'

const AccountKeysImage = (props: IconProps) => {
  const KeyImage = useColorModeValue(
    AccountKeysImageLight,
    AccountKeysImageDark
  )
  return <KeyImage {...props} />
}

export default AccountKeysImage
