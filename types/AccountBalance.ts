import Asset from './Asset'

interface AccountBalance {
  unconfirmedCount: number
  unconfirmed: bigint
  confirmed: bigint
  asset: Asset
}

export default AccountBalance
