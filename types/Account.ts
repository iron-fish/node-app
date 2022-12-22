import { AccountValue } from '@ironfish/sdk'
import AccountBalance from './AccountBalance'

interface Account extends AccountValue {
  balance?: AccountBalance
}

export default Account
