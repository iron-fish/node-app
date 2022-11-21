import { AccountValue } from '@ironfish/sdk'

type CutAccount = Pick<AccountValue, 'id' | 'name' | 'publicAddress'>

export default CutAccount
