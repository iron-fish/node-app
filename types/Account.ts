import { AccountValue } from '@ironfish/sdk'
import AccountBalance from './AccountBalance'

interface Account extends AccountValue {
  balance?: AccountBalance
  order?: number
}

export default Account
