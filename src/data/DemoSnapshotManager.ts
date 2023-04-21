import { nanoid } from 'nanoid'
import EventType from 'Types/EventType'
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

  private onStatusChange(diff: Partial<Omit<ProgressType, 'statistic'>>) {
    this.stat = {
      ...this.stat,
      ...diff,
    }

    const event = new CustomEvent(EventType.SNAPSHOT_STATUS_CHANGE, {
      detail: Object.assign({}, this.stat),
    })

    document.dispatchEvent(event)
  }

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
    this.onStatusChange({
      hasError: false,
      error: null,
    })

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
    this.onStatusChange({
      status: status,
      current: 0,
      total: 378965234,
      estimate: 0,
      hasError: false,
      error: undefined,
    })
    if (status === ProgressStatus.DOWLOADING && !this.downloadError) {
      this.onStatusChange({
        hasError: true,
        error:
          'Connection with server lost. Please check your internet connection and try again.',
      })

      this.downloadError = true
      return
    }
    if (status === ProgressStatus.UNARHIVING && !this.applyError) {
      this.onStatusChange({
        hasError: true,
        error:
          'Cannot unarchive snapshot. Please check that archive is not used by other applications.',
      })

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
          this.onStatusChange({
            current:
              this.stat.current +
              (this.stat.total - this.stat.current < 5000000
                ? this.stat.total - this.stat.current
                : 5000000),
            estimate: ((this.stat.total - this.stat.current) / 5000000) * 100,
          })
          resolve()
        }, 100)
      })
    }

    await this.execute(status + 1)
  }
  async reset() {
    this.onStatusChange({
      status: ProgressStatus.NOT_STARTED,
      current: 0,
      total: 0,
      estimate: 0,
      hasError: false,
      error: undefined,
    })
  }
  async status() {
    return Promise.resolve(Object.assign({}, this.stat))
  }
}

export default DemoSnapshotManager
