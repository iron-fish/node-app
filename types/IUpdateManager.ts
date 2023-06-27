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
  prevVersion?: string
  nextVersion?: string
  isNew?: boolean
}

export interface UpdateMonthVersion {
  month?: string
  version?: string
}

export interface UpdateReleaseNotesResponse {
  data?: ReleaseNote[]
  metadata: {
    has_next: boolean
    has_prev: boolean
    month_range: UpdateMonthVersion[]
  }
}

export enum UpdateManagerAction {
  INITIALIZE = 'initialize',
  CHECK_UPDATES = 'checkUpdates',
  IGNORE_UPDATES = 'ignoreUpdates',
  RESET_ERROR = 'resetError',
  INSTALL_UPDATES = 'installUpdates',
  NOTES = 'notes',
  NOTE = 'note',
  GET_VERSIONS_BEFORE = 'getNewVersions',
  GET_VERSION = 'getVersion',
}

export interface IUpdateManager {
  initialize: () => Promise<void>
  checkUpdates: () => Promise<UpdateStatus>
  ignoreUpdates: () => Promise<UpdateStatus>
  resetError: () => Promise<UpdateStatus>
  installUpdates: () => Promise<void>
  notes: (after?: string, limit?: number) => Promise<UpdateReleaseNotesResponse>
  note: (version: string) => Promise<ReleaseNote>
  getNewVersions: () => Promise<string[]>
  getVersion: () => Promise<string>
}
