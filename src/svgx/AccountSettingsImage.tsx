import { IconProps, useColorMode } from '@ironfish/ui-kit'

import AccountSettingsImageDark from './AccountSettingsImageDark'
import AccountSettingsImageLight from './AccountSettingsImageLight'

const AccountSettingsImage = (props: IconProps) => {
  const { colorMode } = useColorMode()
  return colorMode === 'light' ? (
    <AccountSettingsImageLight {...props} />
  ) : (
    <AccountSettingsImageDark {...props} />
  )
}

export default AccountSettingsImage
