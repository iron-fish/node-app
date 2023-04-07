import {
  IUpdateManager,
  ReleaseNote,
  UpdateReleaseNotesResponse,
  UpdateStatus,
} from 'Types/IUpdateManager'
import axios from 'axios'

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
    version: 'v1.0.0',
  }

  initialize: () => Promise<void> = () => {
    this.url = `${this.serverUrl}/update/${process.platform}/${this.status.version}`

    // if (app.isPackaged) {
    //   autoUpdater.setFeedURL({ url: this.url })

    //   autoUpdater.on(
    //     'update-downloaded',
    //     (e, releaseNotes, releaseName, releaseDate) => {
    //       this.status = {
    //         ...this.status,
    //         hasUpdates: true,
    //         update: {
    //           name: releaseName,
    //           notes: releaseNotes,
    //           date: releaseDate,
    //         },
    //       }
    //     }
    //   )

    //   autoUpdater.on('error', error => {
    //     this.status = {
    //       ...this.status,
    //       hasError: true,
    //       error: error.message,
    //     }
    //   })
    // }

    return Promise.resolve()
  }

  checkUpdates: () => Promise<UpdateStatus> = () => {
    // app.isPackaged && autoUpdater.checkForUpdates()
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
    // app.isPackaged && autoUpdater.quitAndInstall()

    return Promise.resolve()
  }

  notes: (
    after?: string,
    limit?: number
  ) => Promise<UpdateReleaseNotesResponse> = async (
    after: string,
    limit: number
  ) => {
    const res = await axios.get(`${this.serverUrl}/notes`, {
      params: { afterVersion: after, limit },
    })

    return res.data
  }

  note: (version: string) => Promise<ReleaseNote> = async version => {
    return (await axios.get(`${this.serverUrl}/notes/${version}`)).data
  }

  getVersionsBefore: () => Promise<string[]> = async () => {
    try {
      return (
        await axios.get(
          `${this.serverUrl}/notes/before/v${this.status.version}`
        )
      ).data.map((note: ReleaseNote) => note.version)
    } catch (error) {
      return 0
    }
  }
}

export default DemoUpdateManager