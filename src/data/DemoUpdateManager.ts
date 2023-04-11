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
        '* Update buttons outline by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/120\r\n* Add styled Textarea. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/121\r\n* Added paste handling for mnemonic phrase. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/119\r\n\r\n\r\n**Full Changelog**: https://github.com/iron-fish/ui-kit/compare/v1.1.7...v1.1.8',
      prevVersion: 'v1.1.7',
      nextVersion: null,
    },
    {
      version: 'v1.1.7',
      name: 'Version 1.1.7',
      date: new Date('2023-04-03T09:17:48Z'),
      notes:
        '* Update chakra-ui to latest. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/117\r\n\r\n\r\n**Full Changelog**: https://github.com/iron-fish/ui-kit/compare/v1.1.6...v1.1.7',
      prevVersion: 'v1.1.6',
      nextVersion: 'v1.1.8',
    },
    {
      version: 'v1.1.6',
      name: 'Version 1.1.6',
      date: new Date('2023-04-03T09:18:06Z'),
      notes:
        '* Add blinking eye click handler. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/115\r\n\r\n\r\n**Full Changelog**: https://github.com/iron-fish/ui-kit/compare/v1.1.5...v1.1.6',
      prevVersion: 'v1.1.5',
      nextVersion: 'v1.1.7',
    },
    {
      version: 'v1.1.5',
      name: 'Version 1.1.5',
      date: new Date('2023-02-16T11:13:59Z'),
      notes:
        '* Allow to specify amount of words for mnemonic view. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/112\r\n\r\n\r\n**Full Changelog**: https://github.com/iron-fish/ui-kit/compare/v1.1.4...v1.1.5',
      prevVersion: 'v1.1.4',
      nextVersion: 'v1.1.6',
    },
    {
      version: 'v1.1.4',
      name: 'Version 1.1.4',
      date: new Date('2023-02-10T08:28:00Z'),
      notes:
        '* Allow to customize styles for table components by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/109\r\n* Add mnemonic phrase warning mode by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/107\r\n\r\n\r\n**Full Changelog**: https://github.com/iron-fish/ui-kit/compare/v1.1.3...v1.1.4',
      prevVersion: 'v1.1.3',
      nextVersion: 'v1.1.5',
    },
    {
      version: 'v1.1.3',
      name: 'Version 1.1.3',
      date: new Date('2023-01-19T09:39:20Z'),
      notes:
        '* Show clear button when label or helper text available. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/105\r\n\r\n\r\n**Full Changelog**: https://github.com/iron-fish/ui-kit/compare/v1.1.2...v1.1.3',
      prevVersion: 'v1.1.2',
      nextVersion: 'v1.1.4',
    },
    {
      version: 'v1.1.2',
      name: 'Version 1.1.2',
      date: new Date('2022-12-22T12:07:24Z'),
      notes:
        '* Fix autocomplete flip by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/103\r\n* Add stepper component by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/100\r\n\r\n\r\n**Full Changelog**: https://github.com/iron-fish/ui-kit/compare/v1.0.2...v1.1.2',
      prevVersion: 'v1.0.2',
      nextVersion: 'v1.1.3',
    },
    {
      version: 'v1.0.2',
      name: 'Version 1.0.2',
      date: new Date('2022-12-19T13:31:11Z'),
      notes:
        '* Fixed dark mode colors. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/101\r\n\r\n\r\n**Full Changelog**: https://github.com/iron-fish/ui-kit/compare/v1.0.0...v1.0.2',
      prevVersion: 'v1.0.0',
      nextVersion: 'v1.1.2',
    },
    {
      version: 'v1.0.0',
      name: 'Version 1.0.0',
      date: new Date('2022-12-05T13:11:43Z'),
      notes:
        '* Updated Chackra UI version. by @ndemidovich-sc in https://github.com/iron-fish/ui-kit/pull/95\r\n* Add styled toast. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/96\r\n* Added clear button. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/97\r\n\r\n## Breaking changes\r\n* Migrated to react 18 and chakra-ui v2\r\n\r\n**Full Changelog**: https://github.com/iron-fish/ui-kit/compare/v0.0.18...v1.0.0\r\n',
      prevVersion: 'v0.0.18',
      nextVersion: 'v1.0.2',
    },
    {
      version: 'v0.0.18',
      name: 'Release v.0.0.18',
      date: new Date('2022-11-24T04:20:44Z'),
      notes: '* Added `onClose` callback for Autocomplete component',
      prevVersion: 'v0.0.17',
      nextVersion: 'v1.0.0',
    },
    {
      version: 'v0.0.17',
      name: 'Version 0.0.17',
      date: new Date('2022-11-15T14:31:55Z'),
      notes:
        '* (IRO-2683) Fix disabled button hover. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/91\r\n* (IRO-2692) autocomplete overflow. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/92\r\n\r\n\r\n**Full Changelog**: https://github.com/iron-fish/ui-kit/compare/v0.0.16...v0.0.17',
      prevVersion: 'v0.0.16',
      nextVersion: 'v0.0.18',
    },
    {
      version: 'v0.0.16',
      name: 'Version 0.0.16',
      date: new Date('2022-10-20T08:39:49Z'),
      notes:
        '* (IRO-2668) Added progress colors. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/87\r\n* (IRO-2639) Add transaction state icons icons. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/86\r\n* Update Icons story. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/66\r\n\r\n\r\n**Full Changelog**: https://github.com/iron-fish/ui-kit/compare/v0.0.15...v0.0.16',
      prevVersion: 'v0.0.15',
      nextVersion: 'v0.0.17',
    },
    {
      version: 'v0.0.15',
      name: 'Version 0.0.15',
      date: new Date('2022-10-03T12:21:23Z'),
      notes:
        '* [Make menu props not required for Button Group.](https://github.com/iron-fish/ui-kit/commit/56a1340523ad21ea48dafc76e83e76ed4f9fad78)\r\n\r\n\r\n**Full Changelog**: https://github.com/iron-fish/ui-kit/compare/v0.0.14...v0.0.15',
      prevVersion: 'v0.0.14',
      nextVersion: 'v0.0.16',
    },
    {
      version: 'v0.0.14',
      name: 'Version 0.0.14',
      date: new Date('2022-09-30T09:49:10Z'),
      notes:
        '* (IRO-2580) Create buttons group component. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/81\r\n* (IRO-2581) Added compact view for SelectField. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/80\r\n* (IRO-2638) Update table styles for Table. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/83\r\n* (IRO-2625) Make mnemonic view header accept ReactNode. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/82\r\n\r\n\r\n**Full Changelog**: https://github.com/iron-fish/ui-kit/compare/v0.0.13...v0.0.14',
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
  },
}

class DemoUpdateManager implements IUpdateManager {
  // private serverUrl = 'https://wallet-app-deploy.vercel.app/' //need update URL after selecting the update server
  private serverUrl =
    'https://wallet-app-update-server-git-add-notes-endpoint-ironfish.vercel.app' //vercel develop branch server
  // 'http://localhost:5005' //need update URL after selecting the update server
  private url: string
  private status: UpdateStatus = {
    ignoreUpdates: false,
    hasUpdates: false,
    hasError: false,
    version: '1.0.0',
  }

  initialize: () => Promise<void> = () => {
    this.url = `${this.serverUrl}/update/${process.platform}/${this.status.version}`

    setTimeout(() => {
      this.status = {
        ...this.status,
        hasUpdates: true,
        update: {
          name: 'v1.1.8',
          notes: 'just note',
          date: new Date(),
        },
      }
    })

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
}

export default DemoUpdateManager
