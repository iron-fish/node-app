import { AccountValue } from '@ironfish/sdk'
import AccountBalance from './AccountBalance'

interface CutAccount
  extends Pick<AccountValue, 'id' | 'name' | 'publicAddress'> {
  balance: AccountBalance
  order?: number
}

export default CutAccount
