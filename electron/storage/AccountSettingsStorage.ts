import AbstractStorage from './AbstractStorage'
import AccountSettings from 'Types/AccountSettings'
import SortType from 'Types/SortType'
import { app } from 'electron'

class AccountSettingsStorage extends AbstractStorage<AccountSettings> {
  constructor() {
    super(
      {
        filename: `${app.getPath('userData')}/data/accounts_settings.db`,
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
