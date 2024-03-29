import { AccountValue } from '@ironfish/sdk'
import AccountBalance from './AccountBalance'

interface CutAccount
  extends Pick<AccountValue, 'id' | 'name' | 'publicAddress'> {
  balances?: {
    default: AccountBalance
    assets: AccountBalance[]
  }
  viewOnly?: boolean
  order?: number
}

export default CutAccount
