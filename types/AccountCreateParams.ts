import { AccountValue } from '@ironfish/sdk'

interface AccountCreateParams extends AccountValue {
  mnemonicPhrase?: string[]
}

export default AccountCreateParams
