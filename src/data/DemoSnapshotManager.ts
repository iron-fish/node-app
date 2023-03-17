import { nanoid } from 'nanoid'
import {
  IIronfishSnapshotManager,
  ProgressStatus,
  ProgressType,
  SnapshotManifest,
} from 'Types/IronfishManager/IIronfishSnapshotManager'

class DemoSnapshotManager implements IIronfishSnapshotManager {
  stat: Omit<ProgressType, 'statistic'> = {
    current: 0,
    total: 0,
    estimate: 0,
    status: ProgressStatus.NOT_STARTED,
    hasError: false,
    error: null,
  }
  downloadError = false
  applyError = false
  async start(pathToSave: string) {
    this.execute(ProgressStatus.DOWLOADING)
  }

  checkPath(manifest: SnapshotManifest, pathToSave?: string) {
    return Promise.resolve({ hasError: false, error: null })
  }

  apply() {
    return Promise.resolve()
  }

  retry() {
    this.stat.hasError = false
    this.stat.error = null
    return this.execute(this.stat.status)
  }

  manifest(): Promise<SnapshotManifest> {
    return Promise.resolve({
      block_sequence: 675443,
      checksum: nanoid(64),
      database_version: 1204,
      file_name: 'manifest.tar.gz',
      file_size: 378965234,
      timestamp: new Date().getTime(),
    })
  }

  private async execute(status: ProgressStatus): Promise<void> {
    this.stat = {
      status: status,
      current: 0,
      total: 378965234,
      estimate: 0,
      hasError: false,
      error: undefined,
    }
    if (status === ProgressStatus.DOWLOADING && !this.downloadError) {
      this.stat.hasError = true
      this.stat.error =
        'Connection with server lost. Please check your internet connection and try again.'
      this.downloadError = true
      return
    }
    if (status === ProgressStatus.UNARHIVING && !this.applyError) {
      this.stat.hasError = true
      this.stat.error =
        'Cannot unarchive snapshot. Please check that archive is not used by other applications.'
      this.applyError = true
      return
    }
    if (status === ProgressStatus.COMPLETED) {
      return
    }
    if (status === ProgressStatus.DOWNLOADED) {
      return this.execute(status + 1)
    }

    while (true) {
      if (this.stat.current >= this.stat.total) {
        break
      }
      await new Promise<void>(resolve => {
        setTimeout(() => {
          this.stat.current +=
            this.stat.total - this.stat.current < 5000000
              ? this.stat.total - this.stat.current
              : 5000000
          this.stat.estimate =
            ((this.stat.total - this.stat.current) / 5000000) * 100
          resolve()
        }, 100)
      })
    }

    await this.execute(status + 1)
  }
  async reset() {
    this.stat = {
      status: ProgressStatus.NOT_STARTED,
      current: 0,
      total: 0,
      estimate: 0,
      hasError: false,
      error: undefined,
    }
  }
  async status() {
    return Promise.resolve(Object.assign({}, this.stat))
  }
}

export default DemoSnapshotManager
