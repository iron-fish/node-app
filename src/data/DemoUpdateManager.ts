import {
  IUpdateManager,
  ReleaseNote,
  UpdateReleaseNotesResponse,
  UpdateStatus,
} from 'Types/IUpdateManager'

const RELEASE_NOTES: UpdateReleaseNotesResponse = {
  data: [
    {
      version: 'v1.1.8',
      name: 'Version 1.1.8',
      date: new Date('2023-04-03T09:15:54Z'),
      notes:
        '* Update buttons outline \r\n* Add styled Textarea. \r\n* Added paste handling for mnemonic phrase. \r\n',
      prevVersion: 'v1.1.7',
      nextVersion: null,
    },
    {
      version: 'v1.1.7',
      name: 'Version 1.1.7',
      date: new Date('2023-04-03T09:17:48Z'),
      notes: '* Update chakra-ui to latest. \r\n',
      prevVersion: 'v1.1.6',
      nextVersion: 'v1.1.8',
    },
    {
      version: 'v1.1.6',
      name: 'Version 1.1.6',
      date: new Date('2023-04-03T09:18:06Z'),
      notes: '* Add blinking eye click handler. \r\n',
      prevVersion: 'v1.1.5',
      nextVersion: 'v1.1.7',
    },
    {
      version: 'v1.1.5',
      name: 'Version 1.1.5',
      date: new Date('2023-02-16T11:13:59Z'),
      notes: '* Allow to specify amount of words for mnemonic view. \r\n',
      prevVersion: 'v1.1.4',
      nextVersion: 'v1.1.6',
    },
    {
      version: 'v1.1.4',
      name: 'Version 1.1.4',
      date: new Date('2023-02-10T08:28:00Z'),
      notes:
        '* Allow to customize styles for table components \r\n* Add mnemonic phrase warning mode \r\n',
      prevVersion: 'v1.1.3',
      nextVersion: 'v1.1.5',
    },
    {
      version: 'v1.1.3',
      name: 'Version 1.1.3',
      date: new Date('2023-01-19T09:39:20Z'),
      notes: '* Show clear button when label or helper text available. \r\n',
      prevVersion: 'v1.1.2',
      nextVersion: 'v1.1.4',
    },
    {
      version: 'v1.1.2',
      name: 'Version 1.1.2',
      date: new Date('2022-12-22T12:07:24Z'),
      notes: '* Fix autocomplete flip \r\n* Add stepper component \r\n',
      prevVersion: 'v1.0.2',
      nextVersion: 'v1.1.3',
    },
    {
      version: 'v1.0.2',
      name: 'Version 1.0.2',
      date: new Date('2022-12-19T13:31:11Z'),
      notes: '* Fixed dark mode colors. \r\n',
      prevVersion: 'v1.0.0',
      nextVersion: 'v1.1.2',
    },
    {
      version: 'v1.0.0',
      name: 'Version 1.0.0',
      date: new Date('2022-12-05T13:11:43Z'),
      notes:
        '* Updated Chackra UI version. \r\n* Add styled toast. \r\n* Added clear button. * Migrated to react 18 and chakra-ui v2\r\n',
      prevVersion: 'v0.0.18',
      nextVersion: 'v1.0.2',
    },
    {
      version: 'v0.0.18',
      name: 'Release v.0.0.18',
      date: new Date('2022-11-24T04:20:44Z'),
      notes: '* Added `onClose` callback for Autocomplete component\r\n',
      prevVersion: 'v0.0.17',
      nextVersion: 'v1.0.0',
    },
    {
      version: 'v0.0.17',
      name: 'Version 0.0.17',
      date: new Date('2022-11-15T14:31:55Z'),
      notes:
        '* (IRO-2683) Fix disabled button hover. \r\n* (IRO-2692) autocomplete overflow. \r\n',
      prevVersion: 'v0.0.16',
      nextVersion: 'v0.0.18',
    },
    {
      version: 'v0.0.16',
      name: 'Version 0.0.16',
      date: new Date('2022-10-20T08:39:49Z'),
      notes:
        '* (IRO-2668) Added progress colors. \r\n* (IRO-2639) Add transaction state icons icons. \r\n* Update Icons story. \r\n',
      prevVersion: 'v0.0.15',
      nextVersion: 'v0.0.17',
    },
    {
      version: 'v0.0.15',
      name: 'Version 0.0.15',
      date: new Date('2022-10-03T12:21:23Z'),
      notes: '* Make menu props not required for Button Group.\r\n',
      prevVersion: 'v0.0.14',
      nextVersion: 'v0.0.16',
    },
    {
      version: 'v0.0.14',
      name: 'Version 0.0.14',
      date: new Date('2022-09-30T09:49:10Z'),
      notes:
        '* (IRO-2580) Create buttons group component. \r\n* (IRO-2581) Added compact view for SelectField. \r\n* (IRO-2638) Update table styles for Table. \r\n* (IRO-2625) Make mnemonic view header accept ReactNode. \r\n',
      prevVersion: 'null',
      nextVersion: 'v0.0.15',
    },
  ],
  metadata: {
    month_range: [
      { month: 'April 2023', version: 'v1.1.8' },
      { month: 'February 2023', version: 'v1.1.5' },
      { month: 'January 2023', version: 'v1.1.3' },
      { month: 'December 2022', version: 'v1.1.2' },
      { month: 'November 2022', version: 'v0.0.18' },
      {
        month: 'October 2022',
        version: 'v0.0.16',
      },
      {
        month: 'September 2022',
        version: 'v0.0.14',
      },
    ],
    has_next: false,
    has_prev: false,
  },
}

class DemoUpdateManager implements IUpdateManager {
  private serverUrl = 'http://localhost:5005'
  private url: string
  private status: UpdateStatus = {
    ignoreUpdates: false,
    hasUpdates: false,
    hasError: false,
    version: '1.0.0',
  }

  initialize: () => Promise<void> = () => {
    this.url = `${this.serverUrl}/update/demo/${this.status.version}`

    setTimeout(() => {
      this.status = {
        ...this.status,
        hasUpdates: false, //set to true to check how modal window looks
        update: {
          name: 'v1.1.8',
          notes: 'just note',
          date: new Date(),
        },
      }
    }, 10000)

    return Promise.resolve()
  }

  checkUpdates: () => Promise<UpdateStatus> = () => {
    return Promise.resolve(this.status)
  }

  ignoreUpdates: () => Promise<UpdateStatus> = () => {
    this.status = {
      ...this.status,
      ignoreUpdates: true,
    }

    return this.checkUpdates()
  }

  resetError: () => Promise<UpdateStatus> = () => {
    this.status = {
      ...this.status,
      hasError: false,
      error: null,
    }
    return this.checkUpdates()
  }

  installUpdates: () => Promise<void> = () => {
    this.status = {
      ...this.status,
      version: '1.1.8',
      ignoreUpdates: true,
    }
    return Promise.resolve()
  }

  notes: (
    after?: string,
    limit?: number
  ) => Promise<UpdateReleaseNotesResponse> = async (
    after: string,
    limit: number
  ) => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve(RELEASE_NOTES)
      }, 500)
    )
  }

  note: (version: string) => Promise<ReleaseNote> = async version => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve(RELEASE_NOTES.data.find(note => note.version === version))
      }, 500)
    )
  }

  getNewVersions: () => Promise<string[]> = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        const appVersion = `v${this.status.version}`
        const noteIndex = RELEASE_NOTES.data.findIndex(
          ({ version }) => version === appVersion
        )

        resolve(
          noteIndex === -1
            ? []
            : [...RELEASE_NOTES.data.slice(0, noteIndex)].map(
                ({ version }) => version
              )
        )
      }, 500)
    )
  }

  getVersion: () => Promise<string> = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve(this.status.version)
      }, 500)
    )
  }
}

export default DemoUpdateManager
