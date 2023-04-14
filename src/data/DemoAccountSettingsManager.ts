import AccountSettings from 'Types/AccountSettings'
import IStorage from 'Types/IStorage'
import SortType from 'Types/SortType'
import { nanoid } from 'nanoid'

export const ACCOUNT_SETTINGS: AccountSettings[] = [
  {
    _id: nanoid(64),
    accountId:
      'jwbdcLHnLgvnL5oZl554mRWiaiAxmhtWt0dN4djPKntVt5EV443wRMxYzSXX4nX8',
    currency: 'USD',
  },
  {
    _id: nanoid(64),
    accountId:
      'H8BR9byjbep0VDnYhPI0PTKhBPAT84m0nTrNwQBXKxXVosryeyuAJnIwGX754Pi6',
    currency: 'EUR',
  },
  {
    _id: nanoid(64),
    accountId:
      'q1Pr8GLyskDXbBSUM3DMGOOlrNWv5RFloVr57YGxWrh98Afwz5nDCL1nbMIxfhA7',
    currency: 'USD',
  },
]

class DemoAccountSettingsManager implements IStorage<AccountSettings> {
  async add(entity: Omit<AccountSettings, '_id'>): Promise<AccountSettings> {
    ACCOUNT_SETTINGS.push({
      ...entity,
      _id: nanoid(64),
    })
    return ACCOUNT_SETTINGS.at(-1)
  }

  async delete(identity: string): Promise<void> {
    return Promise.resolve()
  }

  async find(
    entity: Partial<Omit<AccountSettings, '_id'>>
  ): Promise<AccountSettings> {
    return new Promise(resolve =>
      setTimeout(() => {
        const currentSetting = ACCOUNT_SETTINGS.find(
          setting => setting.accountId === entity.accountId
        )
        resolve({ ...currentSetting })
      }, 500)
    )
  }

  async get(identity: string): Promise<AccountSettings | null> {
    return new Promise(resolve =>
      setTimeout(() => {
        const setting = ACCOUNT_SETTINGS.find(
          settings => settings.accountId === identity
        )
        return resolve({
          ...setting,
        })
      }, 500)
    )
  }

  async list(searchTerm: string, sort: SortType): Promise<AccountSettings[]> {
    return Promise.resolve([])
  }

  async update(
    identity: string,
    fieldsToUpdate: Partial<Omit<AccountSettings, '_id'>>
  ): Promise<AccountSettings> {
    return new Promise(resolve =>
      setTimeout(() => {
        const currentSettingIndex = ACCOUNT_SETTINGS.findIndex(
          setting => setting._id === identity
        )
        console.log(ACCOUNT_SETTINGS.at(currentSettingIndex))
        const updatedSettings = {
          ...ACCOUNT_SETTINGS.at(currentSettingIndex),
          ...fieldsToUpdate,
        }
        ACCOUNT_SETTINGS.splice(currentSettingIndex, 1, updatedSettings)
        console.log(ACCOUNT_SETTINGS.at(currentSettingIndex))
        resolve({ ...updatedSettings })
      }, 500)
    )
  }
}

export default DemoAccountSettingsManager
