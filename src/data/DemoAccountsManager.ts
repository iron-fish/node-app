import { Account, AccountKeys, AccountSettings } from './types/Account'
import { nanoid } from 'nanoid'
import { generateMnemonic } from 'bip39'

const DEMO_ACCOUNTS: Account[] = [
  {
    address: 'pjqETg9UDzCmE9QSuWwrNO80NC9GNYtLWwyHhw0slynI1lRi9NS3BX_sD8yWtk7D',
    balance: 1259,
    identity:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    name: 'Primary Account',
    pending: 12,
  },
  {
    address: 'R3R4wctME31FBxi8HKo3PDhSYXMkknX_vPAe6gY7eC1gUZww6O9Bif2swAxj8sE6',
    balance: 876,
    identity:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    name: 'Secondary Account',
    pending: 124,
  },
]

const ACCOUNT_KEYS: AccountKeys[] = [
  {
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    authorizationKey:
      'xTbDAiLTrg7hcQg2B5YKFIwJ-u5_IWGs0gudoUInCv30oQSKBmL3ne9hQnn2_6fY',
    mnemonicPhrase: [
      'round',
      'index',
      'spider',
      'virus',
      'fine',
      'initial',
      'limit',
      'only',
      'blush',
      'toy',
      'slow',
      'exhibit',
    ],
    nullifierKey:
      'K1lyvG5Oa8VIrq9DRF9zVwOq7wvET_rhw1bmJIa3U7cWkCzCHCii1XvHAKVyi5sh',
    proofAuthorizationKey:
      'YCrL0RRDJ2cUG9UcVfMugpRmWkC0lBTVkMyHOD6JVMZ40ubrA1CnQ4gVbl9jKxdN',
    spendingKey:
      'JPq_yX-p2PdFev7gGdlCLF9GQw25JHWIb0rNvq-Dnlomj49GNTbOgyn79fHFIQrt',
  },
  {
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    authorizationKey:
      '7KlL8-j4iRAAFmdUD_M-2SL22oNkjDWSS93Tbg_gDIHM9BJqd9I5loDKlMkcXKIt',
    mnemonicPhrase: [
      'nuclear',
      'wedding',
      'super',
      'replace',
      'invite',
      'bonus',
      'eagle',
      'funny',
      'rent',
      'mail',
      'lonely',
      'exclude',
    ],
    nullifierKey:
      'QFStt17oIcUA_n7e8EkKQsjTjJ11JsY_scHaYswcDzr5rZSB2lBMXykCHGBQeSVm',
    proofAuthorizationKey:
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

class DemoAccountsManager {
  create(
    name: string,
    mnemonicPhrase: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string
    ]
  ): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        const id = nanoid(64)
        DEMO_ACCOUNTS.push({
          identity: id,
          address: nanoid(64),
          balance: 0,
          name: name,
          pending: 0,
        })
        ACCOUNT_KEYS.push({
          accountId: id,
          authorizationKey: nanoid(64),
          mnemonicPhrase: mnemonicPhrase,
          nullifierKey: nanoid(64),
          proofAuthorizationKey: nanoid(64),
          spendingKey: nanoid(64),
        })
        ACCOUNT_SETTINGS.push({
          accountId: id,
          currency: 'USD',
        })
        resolve(id)
      }, 500)
    })
  }

  generateMnemonicPhrase(): Promise<string[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(generateMnemonic().split(' '))
      }, 500)
    })
  }

  importBySpendingKey(spendingKey: string): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        const id = nanoid(64)
        DEMO_ACCOUNTS.push({
          identity: id,
          address: nanoid(64),
          balance: 0,
          name: 'Imported Account',
          pending: 0,
        })
        ACCOUNT_KEYS.push({
          accountId: id,
          authorizationKey: nanoid(64),
          mnemonicPhrase: [
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
          ],
          nullifierKey: nanoid(64),
          proofAuthorizationKey: nanoid(64),
          spendingKey: spendingKey,
        })
        ACCOUNT_SETTINGS.push({
          accountId: id,
          currency: 'USD',
        })
        resolve(id)
      }, 500)
    })
  }

  importByMnemonicPhrase(
    mnemonicPhrase: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string
    ]
  ): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        const id = nanoid(64)
        DEMO_ACCOUNTS.push({
          identity: id,
          address: nanoid(64),
          balance: 0,
          name: 'Imported Account',
          pending: 0,
        })
        ACCOUNT_KEYS.push({
          accountId: id,
          authorizationKey: nanoid(64),
          mnemonicPhrase: mnemonicPhrase,
          nullifierKey: nanoid(64),
          proofAuthorizationKey: nanoid(64),
          spendingKey: nanoid(64),
        })
        ACCOUNT_SETTINGS.push({
          accountId: id,
          currency: 'USD',
        })
        resolve(id)
      }, 500)
    })
  }

  importByFile(file: File): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        const id = nanoid(64)
        DEMO_ACCOUNTS.push({
          identity: id,
          address: nanoid(64),
          balance: 0,
          name: 'Imported Account',
          pending: 0,
        })
        ACCOUNT_KEYS.push({
          accountId: id,
          authorizationKey: nanoid(64),
          mnemonicPhrase: [
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
            nanoid(4),
          ],
          nullifierKey: nanoid(64),
          proofAuthorizationKey: nanoid(64),
          spendingKey: nanoid(64),
        })
        ACCOUNT_SETTINGS.push({
          accountId: id,
          currency: 'USD',
        })
        resolve(id)
      }, 500)
    })
  }

  // export() {}

  list(serchTerm: string): Promise<Account[]> {
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve(
            DEMO_ACCOUNTS.filter(
              account =>
                account.name.includes(serchTerm) ||
                account.address.includes(serchTerm)
            )
          ),
        500
      )
    )
  }

  findById(id: string): Promise<Account> {
    return new Promise(resolve =>
      setTimeout(
        () => resolve(DEMO_ACCOUNTS.find(account => account.identity === id)),
        500
      )
    )
  }

  keys(id: string): Promise<AccountKeys> {
    return new Promise(resolve =>
      setTimeout(
        () => resolve(ACCOUNT_KEYS.find(keys => keys.accountId === id)),
        500
      )
    )
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
}

export default DemoAccountsManager
