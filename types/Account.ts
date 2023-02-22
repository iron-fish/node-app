import { AccountValue } from '@ironfish/sdk'
import AccountBalance from './AccountBalance'

interface Account extends AccountValue {
  balances?: {
    default: AccountBalance
    assets: AccountBalance[]
  }
  order?: number
  mnemonicPhrase?: string[]
}

export default Account
