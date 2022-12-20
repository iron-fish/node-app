import { AccountSettings } from './types/Account'
import { AccountValue } from '@ironfish/sdk'
import { nanoid } from 'nanoid'
// seems that it can be used thought preload script
// import { generateMnemonic } from 'bip39'
import randomWords from 'random-words'
import AccountBalance from 'Types/AccountBalance'
import CutAccount from 'Types/CutAccount'
import WalletAccount from 'Types/Account'
import SortType from 'Types/SortType'
import { CurrencyUtils } from '@ironfish/sdk/build/src/utils/currency'

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
  {
    id: 'q1Pr8GLyskDXbBSUM3DMGOOlrNWv5RFloVr57YGxWrh98Afwz5nDCL1nbMIxfhA7',
    name: 'Large balance demo',
    publicAddress:
      'hb7FhUScEm1UOSHGw6DPwSVmWL6gRB7ZKD7jIusykM1bMDOTL62LMyKKiSHuPqRS',
    incomingViewKey:
      'gn0yVhZvyYNZ3rY0tDalqzqz0VbGafQhq8zhsEwkIFbUfTz7PmhMT9BlK9ctYT62',
    outgoingViewKey:
      'xG17AxJB4XrEoGricts13ZfIMLVx4ays4Heh1oA444BID90CzLqhzRin9wEZM225',
    spendingKey:
      'RXFS7bN5gSsnKqSZv208s8EtRwwsHNji3CQuCUlD3jDwlzQ7gfFpsrtf14klpuYF',
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
  {
    accountId:
      'q1Pr8GLyskDXbBSUM3DMGOOlrNWv5RFloVr57YGxWrh98Afwz5nDCL1nbMIxfhA7',
    currency: 'USD',
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
  q1Pr8GLyskDXbBSUM3DMGOOlrNWv5RFloVr57YGxWrh98Afwz5nDCL1nbMIxfhA7: {
    confirmed: BigInt(1222255000002254),
    unconfirmed: BigInt(164),
    pending: BigInt(2200000022310),
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
        ACCOUNT_BALANCES[account.id] = {
          confirmed: BigInt(0),
          unconfirmed: BigInt(0),
          pending: BigInt(0),
          pendingCount: 0,
          unconfirmedCount: 0,
        }
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
        ACCOUNT_BALANCES[newAccount.id] = {
          confirmed: BigInt(0),
          unconfirmed: BigInt(0),
          pending: BigInt(0),
          pendingCount: Math.ceil(Math.random() * 10),
          unconfirmedCount: Math.ceil(Math.random() * 10),
        }
        resolve(newAccount)
      }, 500)
    })
  }

  // export() {}

  list(searchTerm?: string, sort?: SortType): Promise<CutAccount[]> {
    return new Promise(resolve =>
      setTimeout(() => {
        const search = searchTerm?.toLowerCase()
        const accounts = DEMO_ACCOUNTS.map(account => ({
          id: account.id,
          publicAddress: account.publicAddress,
          name: account.name,
          balance: ACCOUNT_BALANCES[account.id],
        })).filter(
          account =>
            !search ||
            account.name.toLowerCase().includes(search) ||
            account.publicAddress.toLowerCase().includes(search) ||
            CurrencyUtils.renderIron(account.balance.confirmed).includes(search)
        )

        if (sort) {
          accounts.sort(
            (a, b) =>
              (SortType.ASC === sort ? 1 : -1) *
              (Number(a.balance.confirmed) - Number(b.balance.confirmed))
          )
        }

        resolve(accounts)
      }, 500)
    )
  }

  findById(id: string): Promise<WalletAccount | null> {
    const account: WalletAccount = DEMO_ACCOUNTS.find(a => a.id === id)

    if (account) {
      account.balance = ACCOUNT_BALANCES[account.id]
    }

    return new Promise(resolve => setTimeout(() => resolve(account), 500))
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

  delete(name: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        DEMO_ACCOUNTS.splice(
          DEMO_ACCOUNTS.findIndex(account => account.name === name),
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
