import { app, autoUpdater } from 'electron'
import { IUpdateManager, ReleaseNote, UpdateStatus } from 'Types/IUpdateManager'

class UpdateManager implements IUpdateManager {
  private serverUrl = 'https://wallet-app-deploy.vercel.app/' //need update URL after selecting the update server
  private url: string
  private status: UpdateStatus = {
    ignoreUpdates: false,
    hasUpdates: false,
    hasError: false,
    version: app.getVersion(),
  }

  initialize: () => Promise<void> = () => {
    this.url = `${this.serverUrl}/update/${
      process.platform
    }/${app.getVersion()}`

    if (app.isPackaged) {
      autoUpdater.setFeedURL({ url: this.url })

      autoUpdater.on(
        'update-downloaded',
        (e, releaseNotes, releaseName, releaseDate) => {
          this.status = {
            ...this.status,
            hasUpdates: true,
            update: {
              name: releaseName,
              notes: releaseNotes,
              date: releaseDate,
            },
          }
        }
      )

      autoUpdater.on('error', error => {
        this.status = {
          ...this.status,
          hasError: true,
          error: error.message,
        }
      })
    }

    return Promise.resolve()
  }

  checkUpdates: () => Promise<UpdateStatus> = () => {
    app.isPackaged && autoUpdater.checkForUpdates()
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
    app.isPackaged && autoUpdater.quitAndInstall()

    return Promise.resolve()
  }

  notes: () => Promise<ReleaseNote[]> = () => {
    return Promise.resolve([
      {
        name: 'Release v0.0.2',
        notes:
          "#### What's Changed\r\n* IRO-1664 - Added customized Select Field. by @ndemidovich-sc in https://github.com/iron-fish/ui-kit/pull/10\r\n* IRO-1665 - Added Autocomplete component. by @ndemidovich-sc in https://github.com/iron-fish/ui-kit/pull/13\r\n* IRO-1673 - Make storybooks available for review by @brekk in https://github.com/iron-fish/ui-kit/pull/18\r\n* IRO-1710 - Added small size for Select by @ndemidovich-sc in https://github.com/iron-fish/ui-kit/pull/16\r\n* Added style for links. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/19\r\n* IRO-1789 - Fixed Autocomplete/Select component styles. by @ndemidovich-sc in https://github.com/iron-fish/ui-kit/pull/20\r\n* IRO-1790 - Improved styles for nav items. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/22\r\n* IRO-1790 - Fix styles for Button, Tab, Tooltip by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/21\r\n* IRO-1792 - Fixed styles for TextField component. by @ndemidovich-sc in https://github.com/iron-fish/ui-kit/pull/23\r\n* IRO-1938 - Fix fonts by @brekk in https://github.com/iron-fish/ui-kit/pull/29\r\n* IRO-1930 -  Updated break points. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/28\r\n* IRO-1929 - Added Card layout style for Box. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/27\r\n* IRO-1793 - Introduce search autocomplete component. by @azhurauski-sc in https://github.com/iron-fish/ui-kit/pull/25",
        date: new Date('2022-04-05T10:43:13Z'),
        version: 'v0.0.2',
      },
      {
        name: 'Release v0.0.1',
        notes:
          '#### Common\r\n- Added Chakra UI as base framework\r\n#### Theme\r\n- **Badge** component\r\n  - Added `navItem` variant\r\n- **Button** component\r\n  - Updated base font styles\r\n  - Added `primary`, `secondary`, `textLink`, `navItem` variants\r\n  - Updated `large` and `medium` sizes\r\n- **Input** component\r\n  - Updated base styles\r\n  - Added `search` and `nav_search` variants\r\n- **Menu** component\r\n  - Updated base styles\r\n- **Table** component\r\n  - Added `blocks` variant\r\n- **Tooltip** component\r\n  - Updated base styles\r\n### Components\r\n- Added **ColorModeSwitcher** component\r\n- Added **TextField** and **FieldGroup** components\r\n- Added **IronFishUIProvider** component',
        date: new Date('2022-05-20T16:16:08Z'),
        version: 'v0.0.1',
      },
    ])
  }

  note: (version: string) => Promise<ReleaseNote> = version => {
    return Promise.resolve({
      name: 'Release v0.0.1',
      notes:
        '#### Common\r\n- Added Chakra UI as base framework\r\n#### Theme\r\n- **Badge** component\r\n  - Added `navItem` variant\r\n- **Button** component\r\n  - Updated base font styles\r\n  - Added `primary`, `secondary`, `textLink`, `navItem` variants\r\n  - Updated `large` and `medium` sizes\r\n- **Input** component\r\n  - Updated base styles\r\n  - Added `search` and `nav_search` variants\r\n- **Menu** component\r\n  - Updated base styles\r\n- **Table** component\r\n  - Added `blocks` variant\r\n- **Tooltip** component\r\n  - Updated base styles\r\n### Components\r\n- Added **ColorModeSwitcher** component\r\n- Added **TextField** and **FieldGroup** components\r\n- Added **IronFishUIProvider** component',
      date: new Date('2022-05-20T16:16:08Z'),
      version: 'v0.0.1',
    })
  }
}

const instance = new UpdateManager()

export default instance
