import { IconProps, useColorMode } from '@ironfish/ui-kit'
import AccountKeysImageDark from './AccountKeysImageDark'
import AccountKeysImageLight from './AccountKeysImageLight'

const AccountKeysImage = (props: IconProps) => {
  const { colorMode } = useColorMode()
  return colorMode === 'light' ? (
    <AccountKeysImageLight {...props} />
  ) : (
    <AccountKeysImageDark {...props} />
  )
}

export default AccountKeysImage
