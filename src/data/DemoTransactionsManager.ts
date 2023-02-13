import { nanoid } from 'nanoid'
import {
  TransactionFeeEstimate,
  TransactionReceiver,
} from 'Types/IronfishManager/IIronfishTransactionManager'
import SortType from 'Types/SortType'

import Transaction, { TransactionStatus } from 'Types/Transaction'
import { ACCOUNT_BALANCES } from './DemoAccountsManager'
import { DEFAULT_ASSET, DEMO_ASSETS } from './DemoAssetManager'

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    amount: { asset: DEFAULT_ASSET, value: BigInt(-1200000000) },
    assetAmounts: [],
    created: new Date('2022-08-26T08:43:00.770Z'),
    creator: true,
    fee: '12000',
    from: 'EuERI13A6py2GYSdcx4OA96X0DL8uSLh5VnqpTqwCGVmgn40GWutuMegDKfI53Zk',
    to: [
      'hCXJwl8cB-pk3sqnxp5op_dgVMWce2vYdr6PT7bdN03gKLt6fWJd2Mxks-vWbhC7',
      'sbVxDJmJHGSKCfom0i33HRPFQvRY4t55ZVSSUwPuhRZcbIvJ0ou4hPHKv3HtGmOi',
      'sbVxDJmJHGSKCfom0i33HRPFQvRY4t55ZVSSUwPuhRZcbIvJ0ou4hPHKv3HtGmOs',
    ],
    hash: 'WnSnNB4EIRm2IzcnISNpN-BhZNGWBoyRS7qEQfUNZcYuFx35nW0nx5z4eN9TsH46',
    isMinersFee: false,
    inputs: [
      {
        value: BigInt(10000000000),
        memo: 'For my friend',
        sender:
          'EuERI13A6py2GYSdcx4OA96X0DL8uSLh5VnqpTqwCGVmgn40GWutuMegDKfI53Zk',
        asset: DEFAULT_ASSET,
      },
    ],
    outputs: [
      {
        value: BigInt(100000),
        memo: 'dziakyi',
        sender:
          'EuERI13A6py2GYSdcx4OA96X0DL8uSLh5VnqpTqwCGVmgn40GWutuMegDKfI53Zk',
        asset: DEFAULT_ASSET,
      },
      {
        value: BigInt(10000),
        memo: 'to you',
        sender:
          'EuERI13A6py2GYSdcx4OA96X0DL8uSLh5VnqpTqwCGVmgn40GWutuMegDKfI53Zk',
        asset: DEFAULT_ASSET,
      },
      {
        value: BigInt(10000),
        memo: 'to you',
        sender:
          'EuERI13A6py2GYSdcx4OA96X0DL8uSLh5VnqpTqwCGVmgn40GWutuMegDKfI53Zk',
        asset: DEFAULT_ASSET,
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
    amount: { asset: DEFAULT_ASSET, value: BigInt(1000000000) },
    assetAmounts: [
      {
        asset: DEMO_ASSETS[1],
        value: BigInt(1000000),
      },
    ],
    creator: false,
    created: new Date('2022-08-25T08:43:00.770Z'),
    fee: '10000',
    to: ['pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D'],
    from: 'OOlgJpCs_om-pVc7vhew3R58cfI5N0Stn4KKZNOVmx2tSN-2wHZTMqFqtL9ackOV',
    hash: 'b8pZEfz6gV0sSp-DzjxrFz5UVFnOPPevrXTEe1UG7qDX8uu69KHazPGJlkoxkMEt',
    isMinersFee: false,
    inputs: [],
    outputs: [
      {
        value: BigInt(100000),
        memo: 'thanks',
        sender:
          'hCXJwl8cB-pk3sqnxp5op_dgVMWce2vYdr6PT7bdN03gKLt6fWJd2Mxks-vWbhC7',
        asset: DEFAULT_ASSET,
      },
      {
        asset: DEMO_ASSETS[1],
        value: BigInt(1000000),
        memo: 'asset to you',
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
    amount: { value: BigInt(10000000000), asset: DEFAULT_ASSET },
    assetAmounts: [],
    creator: false,
    created: new Date('2022-08-24T08:43:00.770Z'),
    fee: '10000',
    to: ['pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D'],
    from: 'OSAblUtjE_cda1CD_baWcpiEWBM3qp0SnZXANluiM7G4psf7Z6ojb3nXFIFaQdBx',
    hash: '8FFiVh1P0vS0fpETvqqM8hRvu06Fm0WG-6QsWezlk_CiP2haxYuqEUixM5vZw7K6',
    isMinersFee: false,
    inputs: [],
    outputs: [
      {
        value: BigInt(100000),
        memo: 'welcome message',
        sender:
          'sbVxDJmJHGSKCfom0i33HRPFQvRY4t55ZVSSUwPuhRZcbIvJ0ou4hPHKv3HtGmOi',
        asset: DEFAULT_ASSET,
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
    amount: { asset: DEFAULT_ASSET, value: BigInt(-123500000000) },
    assetAmounts: [
      {
        asset: DEMO_ASSETS[1],
        value: BigInt(1900000000),
      },
      {
        asset: DEMO_ASSETS[2],
        value: BigInt(70000000),
      },
    ],
    created: new Date('2022-08-23T08:43:00.770Z'),
    creator: true,
    fee: '12350',
    from: 'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
    to: ['R3R4wctME31FBxi8HKo3PDhSYXMkknX_vPAe6gY7eC1gUZww6O9Bif2swAxj8sE6'],
    hash: 's3d8DXMnbjdNT3bn8mPRnjAcOMm4PWJ81wg0P-7wYLK665mp_CyImNBOZGVDtqtK',
    isMinersFee: false,
    inputs: [
      {
        value: BigInt(1380000000000),
        asset: DEFAULT_ASSET,
        memo: 'Experimental',
        sender:
          'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
      },
      {
        value: BigInt(8256000000),
        asset: DEMO_ASSETS[1],
        memo: 'My demo asset',
        sender:
          'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
      },
      {
        value: BigInt(9673000000),
        asset: DEMO_ASSETS[2],
        memo: 'My test asset',
        sender:
          'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
      },
    ],
    outputs: [
      {
        value: BigInt(100000),
        memo: 'aloha',
        sender:
          'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
        asset: DEFAULT_ASSET,
      },
      {
        value: BigInt(154000000),
        memo: 'demo asset for you',
        sender:
          'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
        asset: DEMO_ASSETS[1],
      },
      {
        value: BigInt(297000000),
        memo: 'test asset for you',
        sender:
          'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
        asset: DEMO_ASSETS[2],
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
    amount: { asset: DEFAULT_ASSET, value: BigInt(-1210000000) },
    assetAmounts: [],
    created: new Date('2022-08-21T08:43:00.770Z'),
    creator: true,
    fee: '12100',
    from: 'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
    to: ['7C5NxoCyjt86wtEEHEF1d60omCsaH9tFO6Tf6Rn0jqowxowgbBtCoapcSxn0jrXN'],
    hash: '582-3vDkse_9I8tA4izQ5SMxUAsWtrlXrSdwuzYe7bkvOsJYf6lTNxW3CpK3l3id',
    isMinersFee: false,
    inputs: [
      {
        value: BigInt(12865000000),
        memo: 'Have A GOOD DAY',
        sender:
          'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
        asset: DEFAULT_ASSET,
      },
    ],
    outputs: [
      {
        value: BigInt(100000),
        memo: 'Have A GOOD DAY',
        sender:
          'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
        asset: DEFAULT_ASSET,
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
    amount: { asset: DEFAULT_ASSET, value: BigInt(1200000000) },
    assetAmounts: [],
    creator: false,
    created: new Date('2022-08-22T08:43:00.770Z'),
    fee: '12000',
    to: ['pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D'],
    from: 'OOlgJpCs_om-pVc7vhew3R58cfI5N0Stn4KKZNOVmx2tSN-2wHZTMqFqtL9ackOV',
    hash: 'u7J3we-F22uRiKBohiiYDWYZTAO2FfhDhEs-RcJfY2InSm22KEgBIUGFvJK0DEHN',
    isMinersFee: false,
    inputs: [],
    outputs: [
      {
        value: BigInt(100000),
        memo: 'TASTY',
        sender:
          'OOlgJpCs_om-pVc7vhew3R58cfI5N0Stn4KKZNOVmx2tSN-2wHZTMqFqtL9ackOV',
        asset: DEFAULT_ASSET,
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
              transaction.outputs.find(note =>
                note.memo?.toLowerCase().includes(search)
              ) ||
              transaction.inputs.find(note =>
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
              transaction.outputs.find(note =>
                note.memo?.toLowerCase().includes(search)
              ) ||
              transaction.inputs.find(note =>
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
    receive: TransactionReceiver
  ): Promise<TransactionFeeEstimate> {
    return Promise.resolve({
      low: BigInt(100),
      medium: BigInt(200),
      high: BigInt(300),
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
          amount: { value: amount, asset: DEFAULT_ASSET },
          assetAmounts: [],
          created: new Date(),
          creator: true,
          fee: fee.toString(),
          from: from,
          to: [to],
          hash: nanoid(64),
          size: Math.round(Math.random() * 100000),
          blockHash: nanoid(64),
          isMinersFee: false,
          inputs: [
            {
              value: ACCOUNT_BALANCES[accountId][0]?.confirmed || BigInt(0),
              memo: memo,
              sender: to,
              asset: DEFAULT_ASSET,
            },
          ],
          outputs: [
            {
              value: amount,
              memo: memo,
              sender: from,
              asset: DEFAULT_ASSET,
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
