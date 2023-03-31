export interface UpdateStatus {
  hasUpdates: boolean
  ignoreUpdates: boolean
  hasError: boolean
  version: string
  update?: ReleaseNote
  error?: string
}

export interface ReleaseNote {
  name: string
  notes: string
  version?: string
  date: Date
}

export enum UpdateManagerAction {
  INITIALIZE = 'initialize',
  CHECK_UPDATES = 'checkUpdates',
  IGNORE_UPDATES = 'ignoreUpdates',
  RESET_ERROR = 'resetError',
  INSTALL_UPDATES = 'installUpdates',
  NOTES = 'notes',
  NOTE = 'note',
}

export interface IUpdateManager {
  initialize: () => Promise<void>
  checkUpdates: () => Promise<UpdateStatus>
  ignoreUpdates: () => Promise<UpdateStatus>
  resetError: () => Promise<UpdateStatus>
  installUpdates: () => Promise<void>
  notes: () => Promise<ReleaseNote[]>
  note: (version: string) => Promise<ReleaseNote>
}
