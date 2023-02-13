import CurrencyAsset from './CurrencyAsset'

interface AccountBalance {
  unconfirmedCount: number
  unconfirmed: bigint
  confirmed: bigint
  asset: CurrencyAsset
}

export default AccountBalance
