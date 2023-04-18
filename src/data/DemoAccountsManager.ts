import { AccountValue } from '@ironfish/sdk'
import { nanoid } from 'nanoid'
import randomWords from 'random-words'
import AccountBalance from 'Types/AccountBalance'
import CutAccount from 'Types/CutAccount'
import SortType from 'Types/SortType'
import { formatOreToTronWithLanguage } from 'Utils/number'
import Asset from 'Types/Asset'
import {
  DEFAULT_ASSET,
  DEMO_ASSET,
  IRON_BTC_ASSET,
  IRON_ETH_ASSET,
  TEST_ASSET,
} from './DemoAssetManager'
import Account from 'Types/Account'
import AccountCreateParams from 'Types/AccountCreateParams'
import { IIronfishAccountManager } from 'Types/IronfishManager/IIronfishAccountManager'
import { ACCOUNT_SETTINGS } from './DemoAccountSettingsManager'
import uniqueId from 'lodash/uniqueId'

export const DEMO_ACCOUNTS: AccountValue[] = [
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
    version: 1,
    viewKey: nanoid(64),
    createdAt: null,
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
    version: 1,
    viewKey: nanoid(64),
    createdAt: null,
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
    version: 1,
    viewKey: nanoid(64),
    createdAt: null,
  },
]

export const ACCOUNT_BALANCES: Record<
  string,
  {
    unconfirmedCount: number
    pendingCount: number
    pending: bigint
    unconfirmed: bigint
    confirmed: bigint
    asset: Asset
  }[]
> = {
  jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8: [
    {
      confirmed: BigInt(12364),
      unconfirmed: BigInt(327),
      pending: BigInt(1234),
      pendingCount: 12,
      unconfirmedCount: 3,
      asset: DEFAULT_ASSET,
    },
    {
      confirmed: BigInt(12366),
      unconfirmed: BigInt(327),
      pending: BigInt(1234),
      pendingCount: 12,
      unconfirmedCount: 3,
      asset: TEST_ASSET,
    },
    {
      confirmed: BigInt(12367),
      unconfirmed: BigInt(327),
      pending: BigInt(1234),
      pendingCount: 12,
      unconfirmedCount: 3,
      asset: DEMO_ASSET,
    },
  ],
  H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6: [
    {
      confirmed: BigInt(8481),
      unconfirmed: BigInt(164),
      pending: BigInt(874),
      pendingCount: 8,
      unconfirmedCount: 1,
      asset: DEFAULT_ASSET,
    },
    {
      confirmed: BigInt(8481),
      unconfirmed: BigInt(164),
      pending: BigInt(874),
      pendingCount: 8,
      unconfirmedCount: 1,
      asset: DEMO_ASSET,
    },
    {
      confirmed: BigInt(8481),
      unconfirmed: BigInt(164),
      pending: BigInt(874),
      pendingCount: 8,
      unconfirmedCount: 1,
      asset: TEST_ASSET,
    },
  ],
  q1Pr8GLyskDXbBSUM3DMGOOlrNWv5RFloVr57YGxWrh98Afwz5nDCL1nbMIxfhA7: [
    {
      confirmed: BigInt(122520002254),
      unconfirmed: BigInt(164),
      pending: BigInt(2200000022310),
      pendingCount: 8,
      unconfirmedCount: 1,
      asset: DEFAULT_ASSET,
    },
    {
      confirmed: BigInt(12254),
      unconfirmed: BigInt(164),
      pending: BigInt(2200000022310),
      pendingCount: 8,
      unconfirmedCount: 1,
      asset: DEMO_ASSET,
    },
    {
      confirmed: BigInt(122224),
      unconfirmed: BigInt(164),
      pending: BigInt(2200000022310),
      pendingCount: 8,
      unconfirmedCount: 1,
      asset: TEST_ASSET,
    },
    {
      confirmed: BigInt(1222254),
      unconfirmed: BigInt(164),
      pending: BigInt(2200000022310),
      pendingCount: 8,
      unconfirmedCount: 1,
      asset: IRON_BTC_ASSET,
    },
    {
      confirmed: BigInt(125000254),
      unconfirmed: BigInt(164),
      pending: BigInt(2200000022310),
      pendingCount: 8,
      unconfirmedCount: 1,
      asset: IRON_ETH_ASSET,
    },
  ],
}

class DemoAccountsManager implements IIronfishAccountManager {
  balance(
    id: string,
    assetId: string = DEFAULT_ASSET.id
  ): Promise<AccountBalance> {
    return new Promise(resolve => {
      setTimeout(() => {
        const balance = ACCOUNT_BALANCES[id].find(b => b.asset.id === assetId)
        resolve(balance)
      }, 500)
    })
  }

  balances(id: string): Promise<{
    default: AccountBalance
    assets: AccountBalance[]
  }> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (ACCOUNT_BALANCES[id]) {
          resolve({
            default: ACCOUNT_BALANCES[id][0],
            assets: ACCOUNT_BALANCES[id].slice(1),
          })
        } else {
          resolve(null)
        }
      }, 500)
    })
  }

  create(name: string): Promise<AccountValue> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (DEMO_ACCOUNTS.find(account => name === account.name)) {
          throw new Error(`Account already exists with the name ${name}`)
        }
        const account: AccountValue = {
          id: nanoid(64),
          publicAddress: nanoid(64),
          name: name,
          incomingViewKey: nanoid(64),
          outgoingViewKey: nanoid(64),
          spendingKey: nanoid(64),
          viewKey: nanoid(64),
          version: 1,
          createdAt: null,
        }
        DEMO_ACCOUNTS.push(account)
        ACCOUNT_SETTINGS.push({
          _id: nanoid(64),
          accountId: account.id,
          currency: 'USD',
        })
        ACCOUNT_BALANCES[account.id] = [
          {
            confirmed: BigInt(0),
            unconfirmed: BigInt(0),
            pending: BigInt(0),
            pendingCount: 0,
            unconfirmedCount: 0,
            asset: DEFAULT_ASSET,
          },
        ]
        resolve(account)
      }, 500)
    })
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

  async export(
    id: string,
    encoded?: boolean,
    viewOnly?: boolean
  ): Promise<string> {
    const account = Object.assign({}, await this.get(id))
    delete account.id
    delete account.balances

    return JSON.stringify(account)
  }

  get(id: string): Promise<Account> {
    const accountIndex = DEMO_ACCOUNTS.findIndex(a => a.id === id)
    const account: Account = DEMO_ACCOUNTS[accountIndex]

    if (account) {
      account.balances = {
        default: ACCOUNT_BALANCES[account.id][0],
        assets: ACCOUNT_BALANCES[account.id].slice(1),
      }
      account.order = accountIndex
    }

    return new Promise(resolve => setTimeout(() => resolve(account), 500))
  }

  getMnemonicPhrase(id: string): Promise<string[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(randomWords({ exactly: 24, maxLength: 8 }))
      }, 500)
    })
  }

  import(account: Omit<AccountValue, 'rescan'>): Promise<AccountValue> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (DEMO_ACCOUNTS.find(({ name }) => name === account.name)) {
          throw new Error(
            `Account already exists with the name ${account.name}`
          )
        }

        if (
          DEMO_ACCOUNTS.find(
            ({ spendingKey }) => spendingKey === account.spendingKey
          )
        ) {
          throw new Error(`Account already exists with provided spending key`)
        }
        const newAccount = {
          id: nanoid(64),
          ...account,
        }
        DEMO_ACCOUNTS.push(newAccount)
        ACCOUNT_SETTINGS.push({
          _id: newAccount.id,
          accountId: newAccount.id,
          currency: 'USD',
        })
        ACCOUNT_BALANCES[newAccount.id] = [
          {
            confirmed: BigInt(0),
            unconfirmed: BigInt(0),
            pending: BigInt(0),
            pendingCount: Math.ceil(Math.random() * 10),
            unconfirmedCount: Math.ceil(Math.random() * 10),
            asset: DEFAULT_ASSET,
          },
        ]
        resolve(newAccount)
      }, 500)
    })
  }

  importByMnemonic(name: string, mnemonic: string): Promise<AccountValue> {
    const account: AccountValue = {
      id: nanoid(64),
      incomingViewKey: nanoid(64),
      outgoingViewKey: nanoid(64),
      name: name,
      publicAddress: nanoid(64),
      spendingKey: nanoid(64),
      viewKey: nanoid(64),
      version: 1,
      createdAt: null,
    }
    return this.import(account)
  }

  importByEncodedKey(data: string): Promise<AccountValue> {
    const account: AccountValue = {
      id: nanoid(64),
      incomingViewKey: nanoid(64),
      outgoingViewKey: nanoid(64),
      name: uniqueId('Imported Account'),
      publicAddress: nanoid(64),
      spendingKey: nanoid(64),
      viewKey: nanoid(64),
      version: 1,
      createdAt: null,
    }
    return this.import(account)
  }

  list(searchTerm?: string, sort?: SortType): Promise<CutAccount[]> {
    return new Promise(resolve =>
      setTimeout(() => {
        const search = searchTerm?.toLowerCase()
        const accounts = DEMO_ACCOUNTS.map((account, index) => ({
          id: account.id,
          publicAddress: account.publicAddress,
          name: account.name,
          balances: {
            default: ACCOUNT_BALANCES[account.id][0],
            assets: ACCOUNT_BALANCES[account.id].slice(1),
          },
          order: index,
        })).filter(
          account =>
            !search ||
            account.name.toLowerCase().includes(search) ||
            account.publicAddress.toLowerCase().includes(search) ||
            formatOreToTronWithLanguage(
              account.balances.default.confirmed
            ).includes(search)
        )

        if (sort) {
          accounts.sort(
            (a, b) =>
              (SortType.ASC === sort ? 1 : -1) *
              (Number(a.balances.default.confirmed) -
                Number(b.balances.default.confirmed))
          )
        }

        resolve(accounts)
      }, 500)
    )
  }

  async prepareAccount(): Promise<AccountCreateParams> {
    return {
      id: nanoid(64),
      publicAddress: nanoid(64),
      name: 'name',
      incomingViewKey: nanoid(64),
      outgoingViewKey: nanoid(64),
      spendingKey: nanoid(64),
      viewKey: nanoid(64),
      version: 1,
      mnemonicPhrase: randomWords({ exactly: 24, maxLength: 8 }),
      createdAt: null,
    }
  }

  async submitAccount(createParams: AccountValue): Promise<Account> {
    return this.create(createParams.name)
  }
}

export default DemoAccountsManager
