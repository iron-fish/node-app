import { IconProps, useColorModeValue } from '@ironfish/ui-kit'
import AccountSettingsImageDark from './AccountSettingsImageDark'
import AccountSettingsImageLight from './AccountSettingsImageLight'

const AccountSettingsImage = (props: IconProps) => {
  const KeyImage = useColorModeValue(
    AccountSettingsImageLight,
    AccountSettingsImageDark
  )
  return <KeyImage {...props} />
}

export default AccountSettingsImage
