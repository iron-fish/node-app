import { AccountSettings } from './types/Account'
import { Account, AccountValue } from '@ironfish/sdk'
import { nanoid } from 'nanoid'
// seems that it can be used thought preload script
// import { generateMnemonic } from 'bip39'
import randomWords from 'random-words'
import AccountBalance from 'Types/AccountBalance'
import CutAccount from 'Types/CutAccount'
import SortType from 'Types/SortType'

const DEMO_ACCOUNTS: AccountValue[] = [
  {
    id: 'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    name: 'Primary Account',
    publicAddress:
      'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
    incomingViewKey:
      'K1lyvG5Oa8VIrq9DRF9zVwOq7wvET_rhw1bmJIa3U7cWkCzCHCii1XvHAKVyi5sh',
    outgoingViewKey:
      'xTbDAiLTrg7hcQg2B5YKFIwJ-u5_IWGs0gudoUInCv30oQSKBmL3ne9hQnn2_6fY',
    spendingKey:
      'JPq_yX-p2PdFev7gGdlCLF9GQw25JHWIb0rNvq-Dnlomj49GNTbOgyn79fHFIQrt',
  },
  {
    id: 'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    name: 'Secondary Account',
    publicAddress:
      'R3R4wctME31FBxi8HKo3PDhSYXMkknX_vPAe6gY7eC1gUZww6O9Bif2swAxj8sE6',
    incomingViewKey:
      'QFStt17oIcUA_n7e8EkKQsjTjJ11JsY_scHaYswcDzr5rZSB2lBMXykCHGBQeSVm',
    outgoingViewKey:
      'BcZvMesaZ8Jh_66kBgRhg-0wWls1RS5tWhy2iE96d2t4zpkrnliiEG-zF4oLt0jx',
    spendingKey:
      'E-cVvstCOWfvkiqeR3-Qc4Vm65EqX_I12Ouvavtk75j-z0Vii0I2L9_1JCtz8rlq',
  },
]

const ACCOUNT_SETTINGS: AccountSettings[] = [
  {
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    currency: 'USD',
  },
  {
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    currency: 'EUR',
  },
]

const ACCOUNT_BALANCES: Record<
  string,
  {
    unconfirmedCount: number
    pendingCount: number
    pending: bigint
    unconfirmed: bigint
    confirmed: bigint
  }
> = {
  jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8: {
    confirmed: BigInt(12364),
    unconfirmed: BigInt(327),
    pending: BigInt(1234),
    pendingCount: 12,
    unconfirmedCount: 3,
  },
  H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6: {
    confirmed: BigInt(8481),
    unconfirmed: BigInt(164),
    pending: BigInt(874),
    pendingCount: 8,
    unconfirmedCount: 1,
  },
}

class DemoAccountsManager {
  create(name: string): Promise<AccountValue> {
    return new Promise(resolve => {
      setTimeout(() => {
        const account = {
          id: nanoid(64),
          publicAddress: nanoid(64),
          name: name,
          incomingViewKey: nanoid(64),
          outgoingViewKey: nanoid(64),
          spendingKey: nanoid(64),
        }
        DEMO_ACCOUNTS.push(account)
        ACCOUNT_SETTINGS.push({
          accountId: account.id,
          currency: 'USD',
        })
        resolve(account)
      }, 500)
    })
  }

  generateMnemonicPhrase(): Promise<string[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(randomWords({ exactly: 12, maxLength: 8 }))
      }, 500)
    })
  }

  import(account: Omit<AccountValue, 'id'>): Promise<AccountValue> {
    return new Promise(resolve => {
      setTimeout(() => {
        const newAccount = {
          id: nanoid(64),
          publicAddress: nanoid(64),
          name: 'Imported Account',
          incomingViewKey: nanoid(64),
          outgoingViewKey: nanoid(64),
          spendingKey: nanoid(64),
          ...account,
        }
        DEMO_ACCOUNTS.push(newAccount)
        ACCOUNT_SETTINGS.push({
          accountId: newAccount.id,
          currency: 'USD',
        })
        resolve(newAccount)
      }, 500)
    })
  }

  // export() {}

  list(searchTerm?: string): Promise<CutAccount[]> {
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve(
            DEMO_ACCOUNTS.filter(
              account =>
                !searchTerm ||
                account.name.includes(searchTerm) ||
                account.publicAddress.includes(searchTerm)
            ).map(account => ({
              id: account.id,
              publicAddress: account.publicAddress,
              name: account.name,
            }))
          ),
        500
      )
    )
  }

  findById(id: string): Promise<AccountValue | null> {
    return new Promise(resolve =>
      setTimeout(
        () => resolve(DEMO_ACCOUNTS.find(account => account.id === id)),
        500
      )
    )
  }

  update(identity: string, name: string): Promise<AccountValue> {
    return new Promise(resolve =>
      setTimeout(() => {
        const currentAccount = DEMO_ACCOUNTS.find(
          account => account.id === identity
        )
        currentAccount.name = name
        resolve(currentAccount)
      }, 500)
    )
  }

  delete(identity: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        DEMO_ACCOUNTS.splice(
          DEMO_ACCOUNTS.findIndex(account => account.id === identity),
          1
        )
        resolve()
      }, 500)
    })
  }

  settings(id: string): Promise<AccountSettings> {
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve(ACCOUNT_SETTINGS.find(settings => settings.accountId === id)),
        500
      )
    )
  }

  updateSettings(id: string, currency: string): Promise<AccountSettings> {
    return new Promise(resolve =>
      setTimeout(() => {
        const currentSettings = ACCOUNT_SETTINGS.find(
          setting => setting.accountId === id
        )
        currentSettings.currency = currency
        resolve(currentSettings)
      }, 500)
    )
  }

  balance(id: string): Promise<AccountBalance> {
    return new Promise(resolve => {
      setTimeout(() => {
        const balance = ACCOUNT_BALANCES[id]
        resolve(balance)
      }, 500)
    })
  }
}

export default DemoAccountsManager
