import Asset from './Asset'

interface AccountBalance {
  unconfirmedCount: number
  unconfirmed: bigint
  confirmed: bigint
  available: bigint
  pending: bigint
  asset: Asset
}

export default AccountBalance
