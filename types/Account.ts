import { AccountValue } from '@ironfish/sdk'
import AccountBalance from './AccountBalance'

interface Account extends AccountValue {
  balance?: AccountBalance
  order?: number
  mnemonicPhrase?: string[]
}

export default Account
