interface AccountBalance {
  unconfirmedCount: number
  pendingCount: number
  pending: bigint
  unconfirmed: bigint
  confirmed: bigint
}

export default AccountBalance
