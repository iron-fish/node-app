import AbstractStorage from './AbstractStorage'
import AccountSettings from 'Types/AccountSettings'
import SortType from 'Types/SortType'
import getAppHomeFolder from '../utils/getAppHomeFolder'

export const ACCOUNTS_SETTINGS_STORAGE_NAME = 'accounts_settings.db'

class AccountSettingsStorage extends AbstractStorage<AccountSettings> {
  constructor() {
    super(
      {
        filename: `${getAppHomeFolder()}/${ACCOUNTS_SETTINGS_STORAGE_NAME}`,
        autoload: true,
        timestampData: true,
      },
      [
        {
          fieldName: 'accountId',
          unique: true,
        },
      ]
    )
  }

  list(searchTerm: string, sort: SortType): Promise<AccountSettings[]> {
    return new Promise((resolve, reject) => {
      this.storage
        .find({
          $or: [
            { accountId: new RegExp(searchTerm, 'g') },
            { currency: new RegExp(searchTerm, 'g') },
          ],
        })
        .sort({ accountId: sort === SortType.DESC ? -1 : 1 })
        .exec((err, settings) => {
          if (err) {
            reject(err)
          } else {
            resolve(settings)
          }
        })
    })
  }
}

export default AccountSettingsStorage
