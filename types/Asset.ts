interface Asset {
  createdTransactionHash: string
  id: string
  metadata: string
  name: string
  owner: string
  supply: bigint
}

export default Asset
