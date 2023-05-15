/* eslint-disable no-restricted-imports */
import { ERROR_MESSAGES } from '../../constants'
import { ACCOUNTS_SETTINGS_STORAGE_NAME } from '../../../storage/AccountSettingsStorage'
import { ADDRESS_BOOK_STORAGE_NAME } from '../../../storage/AddressBookStorage'

export const noStorageFileFoundError = (error: Error) => {
  const message = error.message
  if (!message.startsWith(ERROR_MESSAGES.NO_SUCH_FILE_OR_DIR)) {
    return { error }
  }
  if (message.includes(ACCOUNTS_SETTINGS_STORAGE_NAME)) {
    return {
      error: new Error(
        `Can't create/find storage for local account details, please check write permissions for app installation directory`
      ),
      isParsed: true,
    }
  }
  if (message.includes(ADDRESS_BOOK_STORAGE_NAME)) {
    return {
      error: new Error(
        `Can't create/find local storage for address book, please check write permissions for app installation directory`
      ),
      isParsed: true,
    }
  }
}
