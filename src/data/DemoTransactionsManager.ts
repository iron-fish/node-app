import { nanoid } from 'nanoid'
import SortType from 'Types/SortType'

import Transaction, { TransactionStatus } from 'Types/Transaction'

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    amount: '12',
    created: new Date('2022-08-26T08:43:00.770Z'),
    creator: true,
    fee: '0.012',
    from: 'EuERI13A6py2GYSdcx4OA96X0DL8uSLh5VnqpTqwCGVmgn40GWutuMegDKfI53Zk',
    to: '97fu1x7AXPO9pmQcMpvyfeyR8AWBeHPmv6bPdB1cE946BpgwAbTESdNrSUDVrbhr',
    hash: 'vYV2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92BX',
    isMinersFee: false,
    notes: [],
    spends: [],
    status: TransactionStatus.CONFIRMED,
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    expirationSequence: 0,
    notesCount: 0,
    spendsCount: 0,
  },
  {
    amount: '10',
    created: new Date('2022-08-25T08:43:00.770Z'),
    creator: true,
    fee: '0.01',
    to: 'DhUuMS51CioZSQVEp05nzXklomlelMqDWK70DNLLg4vNobtJSKJhNkZ8gOVGVymu',
    from: 'xXqWJOahmVrQQ5paK1Kb7gAS2QkEPYG43G7RfzSnQElDu9WZmVCmhWi8PO39hr9q',
    hash: 'vYV2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92BX',
    isMinersFee: false,
    notes: [],
    spends: [],
    status: TransactionStatus.EXPIRED,
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    expirationSequence: 0,
    notesCount: 0,
    spendsCount: 0,
  },
  {
    amount: '100',
    created: new Date('2022-08-24T08:43:00.770Z'),
    creator: true,
    fee: '0.1',
    to: 'MXaagM3oWH3OXzffgFOo6nbYxqc9Z7SiF5zhFooG0yB5M1xnSd3r4hPmmrSKhvJC',
    from: 'xHubwKNZc906tiN3GBqDPCYtWVSCItx9bpC6UD1I72b943c0eMSS9ipWq3NKJOID',
    hash: 'vYV2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92BX',
    isMinersFee: false,
    notes: [],
    spends: [],
    status: TransactionStatus.PENDING,
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    expirationSequence: 0,
    notesCount: 0,
    spendsCount: 0,
  },
  {
    amount: '1235',
    created: new Date('2022-08-23T08:43:00.770Z'),
    creator: true,
    fee: '0.01235',
    from: 'tQ2ntaJtntysj6ufqzIbLOzOvktPuMVsDHWTSTovMWJU2HIhbLb6NqvbaNxANjgU',
    to: 'R3R4wctME31FBxi8HKo3PDhSYXMkknX_vPAe6gY7eC1gUZww6O9Bif2swAxj8sE6',
    hash: 'vYV2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92BX',
    isMinersFee: false,
    notes: [],
    spends: [],
    status: TransactionStatus.UNCONFIRMED,
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    expirationSequence: 0,
    notesCount: 0,
    spendsCount: 0,
  },
  {
    amount: '121',
    created: new Date('2022-08-21T08:43:00.770Z'),
    creator: true,
    fee: '0.0121',
    from: 'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
    to: 'eBpm3UivfNtMdVf82e8fzUACM5tuZGEmeB0S1z8gyYLpECW5Ct1295DD05Lh2X04',
    hash: 'vYV2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92BX',
    isMinersFee: false,
    notes: [],
    spends: [],
    status: TransactionStatus.UNKNOWN,
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    expirationSequence: 0,
    notesCount: 0,
    spendsCount: 0,
  },
  {
    amount: '12',
    created: new Date('2022-08-22T08:43:00.770Z'),
    creator: true,
    fee: '0.0012',
    to: 'XCT3LdATRBhBbbxzEsoZwAfvjQiSSbNwwa5IagFWKev0RYhTKjFJNyBXKR61AF3L',
    from: 'hCXJwl8cB-pk3sqnxp5op_dgVMWce2vYdr6PT7bdN03gKLt6fWJd2Mxks-vWbhC7',
    hash: 'vYV2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92BX',
    isMinersFee: false,
    notes: [],
    spends: [],
    status: TransactionStatus.CONFIRMED,
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    expirationSequence: 0,
    notesCount: 0,
    spendsCount: 0,
  },
]

class DemoTransactionsManager {
  get(hash: string, accountId: string): Promise<Transaction | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const transaction = DEMO_TRANSACTIONS.find(
          tr => tr.accountId === accountId && tr.hash === hash
        )
        resolve(transaction)
      }, 500)
    })
  }

  findByAddress(
    address: string,
    searchTerm?: string,
    sort?: SortType
  ): Promise<Transaction[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const transactions = DEMO_TRANSACTIONS.filter(
          transaction =>
            (transaction.from === address || transaction.to === address) &&
            (!searchTerm ||
              transaction.hash.includes(searchTerm) ||
              transaction.from.includes(searchTerm) ||
              transaction.to.includes(searchTerm))
        )
        transactions.sort(
          (a, b) =>
            (a.created.getTime() - b.created.getTime()) *
            (sort === SortType.ASC ? 1 : -1)
        )
        resolve(transactions)
      }, 500)
    })
  }

  findByAccountId(
    accountId: string,
    searchTerm?: string,
    sort?: SortType
  ): Promise<Transaction[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const transactions = DEMO_TRANSACTIONS.filter(
          transaction =>
            transaction.accountId === accountId &&
            (!searchTerm ||
              transaction.hash.includes(searchTerm) ||
              transaction.from.includes(searchTerm) ||
              transaction.to.includes(searchTerm))
        )
        transactions.sort(
          (a, b) =>
            (a.created.getTime() - b.created.getTime()) *
            (sort === SortType.ASC ? 1 : -1)
        )
        resolve(transactions)
      }, 500)
    })
  }

  calculateFee(amount: number): Promise<number> {
    return new Promise(resolve => {
      setTimeout(() => resolve(amount / 1000), 500)
    })
  }

  send(
    accountId: string,
    from: string,
    to: string,
    amount: number,
    memo: string,
    fee: number
  ): Promise<Transaction> {
    return new Promise(resolve => {
      setTimeout(() => {
        const transaction: Transaction = {
          amount: amount.toString(),
          created: new Date(),
          creator: true,
          fee: fee.toString(),
          from: from,
          to: to,
          hash: nanoid(64),
          isMinersFee: false,
          notes: [
            {
              value: BigInt(amount),
              memo: memo,
            },
          ],
          spends: [],
          status: TransactionStatus.CONFIRMED,
          accountId: accountId,
          expirationSequence: 0,
          notesCount: 0,
          spendsCount: 0,
        }
        DEMO_TRANSACTIONS.push(transaction)
        resolve(transaction)
      }, 500)
    })
  }
}

export default DemoTransactionsManager
