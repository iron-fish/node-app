import { nanoid } from 'nanoid'
import { TransactionFeeEstimate } from 'Types/IronfishManager/IIronfishTransactionManager'
import SortType from 'Types/SortType'
import { Payment } from 'Types/Transaction'

import Transaction, { TransactionStatus } from 'Types/Transaction'
import { formatOreToTronWithLanguage } from 'Utils/number'

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    amount: formatOreToTronWithLanguage(BigInt('-1200000')),
    created: new Date('2022-08-26T08:43:00.770Z'),
    creator: true,
    fee: '12000',
    from: 'EuERI13A6py2GYSdcx4OA96X0DL8uSLh5VnqpTqwCGVmgn40GWutuMegDKfI53Zk',
    to: [
      'hCXJwl8cB-pk3sqnxp5op_dgVMWce2vYdr6PT7bdN03gKLt6fWJd2Mxks-vWbhC7',
      'sbVxDJmJHGSKCfom0i33HRPFQvRY4t55ZVSSUwPuhRZcbIvJ0ou4hPHKv3HtGmOi',
      'sbVxDJmJHGSKCfom0i33HRPFQvRY4t55ZVSSUwPuhRZcbIvJ0ou4hPHKv3HtGmOs',
    ],
    hash: 'v1V2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92B1',
    isMinersFee: false,
    notes: [
      {
        value: BigInt(100000),
        memo: 'dziakyi',
        sender:
          'EuERI13A6py2GYSdcx4OA96X0DL8uSLh5VnqpTqwCGVmgn40GWutuMegDKfI53Zk',
      },
      {
        value: BigInt(10000),
        memo: 'to you',
        sender:
          'EuERI13A6py2GYSdcx4OA96X0DL8uSLh5VnqpTqwCGVmgn40GWutuMegDKfI53Zk',
      },
      {
        value: BigInt(10000),
        memo: 'to you',
        sender:
          'EuERI13A6py2GYSdcx4OA96X0DL8uSLh5VnqpTqwCGVmgn40GWutuMegDKfI53Zk',
      },
    ],
    spends: [
      {
        commitment: nanoid(64),
        nullifier: nanoid(64),
        size: Math.floor(Math.random() * 100000),
      },
    ],
    size: Math.round(Math.random() * 100000),
    blockHash: nanoid(64),
    status: TransactionStatus.CONFIRMED,
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    expiration: 0,
    notesCount: 0,
    spendsCount: 0,
  },
  {
    amount: formatOreToTronWithLanguage(BigInt('100000')),
    creator: false,
    created: new Date('2022-08-25T08:43:00.770Z'),
    fee: '10000',
    to: ['pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D'],
    from: 'OOlgJpCs_om-pVc7vhew3R58cfI5N0Stn4KKZNOVmx2tSN-2wHZTMqFqtL9ackOV',
    hash: 'v2V2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92B2',
    isMinersFee: false,
    notes: [
      {
        value: BigInt(100000),
        memo: 'thanks',
        sender:
          'hCXJwl8cB-pk3sqnxp5op_dgVMWce2vYdr6PT7bdN03gKLt6fWJd2Mxks-vWbhC7',
      },
    ],
    spends: [],
    size: Math.round(Math.random() * 100000),
    blockHash: nanoid(64),
    status: TransactionStatus.EXPIRED,
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    expiration: 0,
    notesCount: 0,
    spendsCount: 0,
  },
  {
    amount: formatOreToTronWithLanguage(BigInt('1000000')),
    creator: false,
    created: new Date('2022-08-24T08:43:00.770Z'),
    fee: '10000',
    to: ['pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D'],
    from: 'OSAblUtjE_cda1CD_baWcpiEWBM3qp0SnZXANluiM7G4psf7Z6ojb3nXFIFaQdBx',
    hash: 'v3V2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92B3',
    isMinersFee: false,
    notes: [
      {
        value: BigInt(100000),
        memo: 'welcome message',
        sender:
          'sbVxDJmJHGSKCfom0i33HRPFQvRY4t55ZVSSUwPuhRZcbIvJ0ou4hPHKv3HtGmOi',
      },
    ],
    spends: [],
    size: Math.round(Math.random() * 100000),
    blockHash: nanoid(64),
    status: TransactionStatus.PENDING,
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    expiration: 0,
    notesCount: 0,
    spendsCount: 0,
  },
  {
    amount: formatOreToTronWithLanguage(BigInt('-12345000')),
    created: new Date('2022-08-23T08:43:00.770Z'),
    creator: true,
    fee: '12350',
    from: 'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
    to: ['R3R4wctME31FBxi8HKo3PDhSYXMkknX_vPAe6gY7eC1gUZww6O9Bif2swAxj8sE6'],
    hash: 'v4V2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92B4',
    isMinersFee: false,
    notes: [
      {
        value: BigInt(100000),
        memo: 'aloha',
        sender:
          'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
      },
    ],
    spends: [
      {
        commitment: nanoid(64),
        nullifier: nanoid(64),
        size: Math.floor(Math.random() * 100000),
      },
    ],
    size: Math.round(Math.random() * 100000),
    blockHash: nanoid(64),
    status: TransactionStatus.UNCONFIRMED,
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    expiration: 0,
    notesCount: 0,
    spendsCount: 0,
  },
  {
    amount: formatOreToTronWithLanguage(BigInt('-1210000')),
    created: new Date('2022-08-21T08:43:00.770Z'),
    creator: true,
    fee: '12100',
    from: 'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
    to: ['7C5NxoCyjt86wtEEHEF1d60omCsaH9tFO6Tf6Rn0jqowxowgbBtCoapcSxn0jrXN'],
    hash: 'v5V2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92B5',
    isMinersFee: false,
    notes: [
      {
        value: BigInt(100000),
        memo: 'Have A GOOD DAY',
        sender:
          'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
      },
    ],
    spends: [
      {
        commitment: nanoid(64),
        nullifier: nanoid(64),
        size: Math.floor(Math.random() * 100000),
      },
    ],
    size: Math.round(Math.random() * 100000),
    blockHash: nanoid(64),
    status: TransactionStatus.UNKNOWN,
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    expiration: 0,
    notesCount: 0,
    spendsCount: 0,
  },
  {
    amount: formatOreToTronWithLanguage(BigInt('120000')),
    creator: false,
    created: new Date('2022-08-22T08:43:00.770Z'),
    fee: '12000',
    to: ['pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D'],
    from: 'OOlgJpCs_om-pVc7vhew3R58cfI5N0Stn4KKZNOVmx2tSN-2wHZTMqFqtL9ackOV',
    hash: 'v6V2LiD2Lh_KnPGjk2k31k1J_1XqvxUW57G1bEfMKPN4WKAwayEvd3zKPSjx92BX',
    isMinersFee: false,
    notes: [
      {
        value: BigInt(100000),
        memo: 'TASTY',
        sender:
          'OOlgJpCs_om-pVc7vhew3R58cfI5N0Stn4KKZNOVmx2tSN-2wHZTMqFqtL9ackOV',
      },
    ],
    spends: [],
    size: Math.round(Math.random() * 100000),
    blockHash: nanoid(64),
    status: TransactionStatus.CONFIRMED,
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    expiration: 0,
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
        const search = searchTerm?.toLowerCase()
        const transactions = DEMO_TRANSACTIONS.filter(
          transaction =>
            (transaction.from === address ||
              transaction.to.includes(address)) &&
            (!search ||
              transaction.hash.toLowerCase().includes(search) ||
              transaction.from.toLowerCase().includes(search) ||
              transaction.to.find(a => a.toLowerCase().includes(search)) ||
              transaction.notes.find(note =>
                note.memo?.toLowerCase().includes(search)
              ) ||
              transaction.amount.toString().includes(search))
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
        const search = searchTerm?.toLowerCase()
        const transactions = DEMO_TRANSACTIONS.filter(
          transaction =>
            transaction.accountId === accountId &&
            (!search ||
              transaction.hash.toLowerCase().includes(search) ||
              transaction.from.toLowerCase().includes(search) ||
              transaction.to.find(a => a.toLowerCase().includes(search)) ||
              transaction.notes.find(note =>
                note.memo?.toLowerCase().includes(search)
              ) ||
              transaction.amount.toString().includes(search))
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

  estimateFeeWithPriority(
    accountId: string,
    receive: Payment
  ): Promise<TransactionFeeEstimate> {
    return Promise.resolve({
      slow: BigInt(1),
      average: BigInt(2),
      fast: BigInt(3),
    })
  }

  send(
    accountId: string,
    from: string,
    to: string,
    amount: bigint,
    memo: string,
    fee: bigint
  ): Promise<Transaction> {
    return new Promise(resolve => {
      setTimeout(() => {
        const transaction: Transaction = {
          amount: formatOreToTronWithLanguage(amount),
          created: new Date(),
          creator: true,
          fee: fee.toString(),
          from: from,
          to: [to],
          hash: nanoid(64),
          size: Math.round(Math.random() * 100000),
          blockHash: nanoid(64),
          isMinersFee: false,
          notes: [
            {
              value: amount,
              memo: memo,
              sender: from,
            },
          ],
          spends: [],
          status: TransactionStatus.PENDING,
          accountId: accountId,
          expiration: 0,
          notesCount: 0,
          spendsCount: 0,
        }
        DEMO_TRANSACTIONS.push(transaction)
        resolve(transaction)
        setTimeout(() => {
          transaction.status =
            memo === 'Expired'
              ? TransactionStatus.EXPIRED
              : TransactionStatus.CONFIRMED
        }, 30000)
      }, 500)
    })
  }
}

export default DemoTransactionsManager
