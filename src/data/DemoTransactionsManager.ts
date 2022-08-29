import { nanoid } from 'nanoid'

import { Transaction } from './types/Transaction'

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    amount: 12,
    created: '2022-08-26T08:43:00.770Z',
    creator: true,
    expiration: 10,
    fee: 0.012,
    from: 'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
    to: 'R3R4wctME31FBxi8HKo3PDhSYXMkknX_vPAe6gY7eC1gUZww6O9Bif2swAxj8sE6',
    hash: 'vYV2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92BX',
    isMinersFee: false,
    notes: [],
    spends: 0,
    status: 'success',
  },
  {
    amount: 10,
    created: '2022-08-26T08:43:00.770Z',
    creator: true,
    expiration: 10,
    fee: 0.01,
    to: 'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
    from: 'R3R4wctME31FBxi8HKo3PDhSYXMkknX_vPAe6gY7eC1gUZww6O9Bif2swAxj8sE6',
    hash: 'vYV2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92BX',
    isMinersFee: false,
    notes: [],
    spends: 0,
    status: 'success',
  },
  {
    amount: 100,
    created: '2022-08-26T08:43:00.770Z',
    creator: true,
    expiration: 10,
    fee: 0.1,
    to: 'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
    from: 'R3R4wctME31FBxi8HKo3PDhSYXMkknX_vPAe6gY7eC1gUZww6O9Bif2swAxj8sE6',
    hash: 'vYV2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92BX',
    isMinersFee: false,
    notes: [],
    spends: 0,
    status: 'success',
  },
  {
    amount: 1235,
    created: '2022-08-26T08:43:00.770Z',
    creator: true,
    expiration: 10,
    fee: 0.01235,
    from: 'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
    to: 'R3R4wctME31FBxi8HKo3PDhSYXMkknX_vPAe6gY7eC1gUZww6O9Bif2swAxj8sE6',
    hash: 'vYV2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92BX',
    isMinersFee: false,
    notes: [],
    spends: 0,
    status: 'success',
  },
  {
    amount: 121,
    created: '2022-08-26T08:43:00.770Z',
    creator: true,
    expiration: 10,
    fee: 0.0121,
    from: 'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
    to: 'hCXJwl8cB-pk3sqnxp5op_dgVMWce2vYdr6PT7bdN03gKLt6fWJd2Mxks-vWbhC7',
    hash: 'vYV2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92BX',
    isMinersFee: false,
    notes: [],
    spends: 0,
    status: 'success',
  },
  {
    amount: 12,
    created: '2022-08-26T08:43:00.770Z',
    creator: true,
    expiration: 10,
    fee: 0.0012,
    to: 'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
    from: 'hCXJwl8cB-pk3sqnxp5op_dgVMWce2vYdr6PT7bdN03gKLt6fWJd2Mxks-vWbhC7',
    hash: 'vYV2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92BX',
    isMinersFee: false,
    notes: [],
    spends: 0,
    status: 'success',
  },
]

class DemoTransactionsManager {
  findByAddress(address: string): Promise<Transaction[]> {
    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve(
            DEMO_TRANSACTIONS.filter(
              transaction =>
                transaction.from === address || transaction.to === address
            )
          ),
        500
      )
    })
  }

  calculateFee(amount: number): Promise<number> {
    return new Promise(resolve => {
      setTimeout(() => resolve(amount / 1000), 500)
    })
  }

  send(
    from: string,
    to: string,
    amount: number,
    memo: string,
    fee: number
  ): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        const hash = nanoid(64)
        DEMO_TRANSACTIONS.push({
          amount: amount,
          created: new Date().toISOString(),
          creator: true,
          expiration: 10,
          fee: fee,
          from: from,
          to: to,
          hash: nanoid(64),
          isMinersFee: false,
          notes: [
            {
              amount: amount,
              memo: memo,
              spender: true,
            },
          ],
          spends: 0,
          status: 'success',
        })
        resolve(hash)
      }, 500)
    })
  }
}

export default DemoTransactionsManager
