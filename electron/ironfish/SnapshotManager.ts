import axios from 'axios'
import checkDiskSpace from 'check-disk-space'
import crypto from 'crypto'
import fs from 'fs'
import { deleteAsync } from 'del'
import path from 'path'
import tar from 'tar'
import { IronfishNode, Meter, VERSION_DATABASE_CHAIN } from '@ironfish/sdk'
import {
  IIronfishSnapshotManager,
  ProgressStatus,
  ProgressType,
  SnapshotManifest,
} from 'Types/IronfishManager/IIronfishSnapshotManager'

const MANIFEST_URL = 'https://snapshots.ironfish.network/manifest.json'

class SnapshotManager implements IIronfishSnapshotManager {
  private node: IronfishNode
  private progress: ProgressType
  private filePath: string
  private pathToSave: string

  constructor(node: IronfishNode) {
    this.node = node
    this.progress = {
      status: ProgressStatus.NOT_STARTED,
      current: 0,
      total: 0,
      estimate: 0,
      statistic: null,
      hasError: false,
    }
  }

  async manifest(): Promise<SnapshotManifest> {
    return (await axios.get<SnapshotManifest>(MANIFEST_URL)).data
  }

  async checkPath(
    manifest: SnapshotManifest,
    pathToSave?: string
  ): Promise<{
    hasError: boolean
    error: string
  }> {
    const savePath =
      pathToSave || path.resolve(this.node.config.dataDir, 'temp')
    if (manifest.database_version > VERSION_DATABASE_CHAIN) {
      return {
        hasError: true,
        error:
          'Snapshot is used more actual database version. Please try to update application.',
      }
    }

    try {
      await fs.promises.mkdir(savePath, { recursive: true })
    } catch (e) {
      return {
        hasError: true,
        error:
          'Cannot get access to selected folder. Please check the path and permissions.',
      }
    }

    const diskSpace = await checkDiskSpace(savePath)

    if (diskSpace.free < manifest.file_size * 2) {
      return {
        hasError: true,
        error: "You don't have enougth free space in selected folder.",
      }
    }

    return {
      hasError: false,
      error: undefined,
    }
  }

  async start(pathToSave?: string): Promise<void> {
    if (!this.node) {
      this.progress.hasError = true
      this.progress.error = 'Node is not initialized'
      return
    }

    const savePath =
      pathToSave || path.resolve(this.node.config.dataDir, 'temp')

    const manifest = await this.manifest()

    const result = await this.checkPath(manifest, savePath)

    if (result.hasError) {
      this.progress.hasError = true
      this.progress.error =
        "You don't have enougth space for succesfull applying of snapshot. Please choose another folder."
      return
    }

    this.pathToSave = savePath

    this.download(manifest)
  }

  async apply() {
    await this.node.shutdown()
    await this.node.closeDB()

    this.clearDatabase()
      .then(() => this.unarchive())
      .then(() => this.clearTemporaryFiles())
      .then(() => {
        this.progress.status = ProgressStatus.COMPLETED
      })
      .catch(e => {
        throw e
      })
  }

  async retry(): Promise<void> {
    if (this.progress.status === ProgressStatus.NOT_STARTED) {
      return Promise.reject('Nothing to retry.')
    }
    if (
      !this.progress.hasError &&
      this.progress.status > ProgressStatus.NOT_STARTED
    ) {
      return Promise.reject('Flow already in progress')
    }

    this.progress.error = null
    this.progress.hasError = false

    if (this.progress.status < ProgressStatus.DOWNLOADED) {
      const manifest = await this.manifest()
      this.download(manifest)
    } else {
      this.apply()
    }
  }

  private async download(manifest: SnapshotManifest): Promise<void> {
    this.progress = {
      current: 0,
      total: manifest.file_size,
      statistic: new Meter(),
      status: ProgressStatus.DOWLOADING,
      estimate: Number.MAX_VALUE,
      hasError: false,
    }

    this.progress.statistic.start()

    let snapshotUrl

    try {
      snapshotUrl = new URL(manifest.file_name).toString()
    } catch (e) {
      const url = new URL(MANIFEST_URL)
      const parts = url.pathname.split('/').filter(s => !!s.trim())
      parts.pop()
      parts.push(manifest.file_name)
      url.pathname = parts.join('/')
      snapshotUrl = url.toString()
    }

    this.filePath = path.resolve(
      this.pathToSave,
      `snapshot_${manifest.timestamp}.tar.gz`
    )

    const writer = fs.createWriteStream(this.filePath, { flags: 'w' })

    const hasher = crypto.createHash('sha256')
    const idleCancelSource = axios.CancelToken.source()

    const response = await axios({
      method: 'GET',
      responseType: 'stream',
      url: snapshotUrl,
      cancelToken: idleCancelSource.token,
    })

    await new Promise<void>((resolve, reject) => {
      const onWriterError = (e: unknown) => {
        writer.removeListener('close', onWriterClose)
        writer.removeListener('error', onWriterError)
        reject(e)
      }
      const onWriterClose = () => {
        writer.removeListener('close', onWriterClose)
        writer.removeListener('error', onWriterError)
        resolve()
      }
      writer.on('error', onWriterError)
      writer.on('close', onWriterClose)

      response.data.on('error', (e: Error) => {
        this.progress.hasError = true
        this.progress.error =
          'Connection with server lost. Please check your internet connection and try again.'
        writer.destroy(e)
      })

      response.data.on('end', () => {
        writer.close()
      })

      response.data.on('data', (chunk: Buffer) => {
        writer.write(chunk)
        hasher.write(chunk)

        this.progress.current += chunk.length
        this.progress.statistic.add(chunk.length)
        this.progress.estimate = Math.round(
          (this.progress.total - this.progress.current) /
            this.progress.statistic.avg
        )
      })
    })

    this.progress.statistic.stop()

    if (this.progress.hasError) {
      return Promise.reject()
    }

    const checksum = hasher.digest().toString('hex')
    if (checksum !== manifest.checksum) {
      this.progress.hasError = true
      this.progress.error = "Snapshot checksum doesn't match."
      return Promise.reject()
    }

    this.progress.status = ProgressStatus.DOWNLOADED
  }

  private async unarchive(): Promise<void> {
    this.progress = {
      current: 0,
      total: 0,
      statistic: new Meter(),
      status: ProgressStatus.UNARHIVING,
      estimate: 0,
      hasError: false,
    }

    this.progress.statistic.start()

    let totalSize = 0
    const extractPath = this.node.files.resolve(
      this.node.config.chainDatabasePath
    )
    await fs.promises.mkdir(extractPath, { recursive: true })

    try {
      await tar.list({
        file: this.filePath,
        onentry: entry => {
          totalSize += entry.size
        },
      })

      this.progress.total = totalSize

      await tar.extract({
        file: this.filePath,
        C: extractPath,
        strip: 1,
        strict: true,
        onentry: entry => {
          this.progress.current += entry.size
          this.progress.statistic.add(entry.size)
          this.progress.estimate = Math.round(
            ((this.progress.total - this.progress.current) /
              this.progress.statistic.avg) *
              1000
          )
        },
      })
    } catch (e) {
      this.progress.hasError = true
      this.progress.error =
        'Cannot unarchiving snapshot. Please check, that archive is not used by another applications.'
    }

    this.progress.statistic.stop()

    if (this.progress.hasError) {
      return Promise.reject()
    }
  }

  private async clearDatabase(): Promise<void> {
    this.progress = {
      current: 0,
      total: 0,
      statistic: new Meter(),
      status: ProgressStatus.CLEARING_CHAIN_DB,
      estimate: 0,
      hasError: false,
    }

    this.progress.statistic.start()
    await this.node.shutdown()
    await this.node.closeDB()
    const chainDatabasePath = this.node.files.resolve(
      this.node.config.chainDatabasePath
    )

    try {
      await deleteAsync(chainDatabasePath, {
        onProgress: stat => {
          this.progress.statistic.add(stat.deletedCount - this.progress.current)
          this.progress.current = stat.deletedCount
          this.progress.total = stat.totalCount
          this.progress.estimate = this.progress.estimate = Math.round(
            (this.progress.total - this.progress.current) /
              this.progress.statistic.avg
          )
        },
        force: true,
      })
    } catch (e) {
      this.progress.hasError = true
      this.progress.error =
        'Imposible to delete current chain database files. Please check, that files is not used by another applications.'
      this.progress.statistic.stop()
      return Promise.reject()
    }

    this.progress.statistic.stop()
  }

  private async clearTemporaryFiles(): Promise<void> {
    this.progress = {
      current: 0,
      total: 1,
      statistic: new Meter(),
      status: ProgressStatus.CLEARING_TEMP_DATA,
      estimate: Number.MAX_VALUE,
      hasError: false,
    }
    this.progress.statistic.start()

    try {
      await fs.promises.rm(this.filePath, { recursive: true, maxRetries: 10 })
      this.progress.statistic.add(1)
      this.progress.current++
      this.progress.estimate = this.progress.estimate = Math.round(
        (this.progress.total - this.progress.current) /
          this.progress.statistic.avg
      )
    } catch (e) {
      this.progress.hasError = true
      this.progress.error =
        'Imposible to clear temporary files. Please check, that files not used by another applications.'
      this.progress.statistic.stop()
      return Promise.reject()
    }

    this.progress.statistic.stop()
  }

  status(): Promise<Omit<ProgressType, 'statistic'>> {
    return Promise.resolve({
      status: this.progress?.status,
      current: this.progress?.current,
      total: this.progress?.total,
      estimate: this.progress?.estimate,
      hasError: this.progress?.hasError,
      error: this.progress?.error,
    })
  }

  async reset(): Promise<void> {
    this.progress = {
      status: ProgressStatus.NOT_STARTED,
      current: 0,
      total: 0,
      estimate: 0,
      statistic: null,
      hasError: false,
    }
  }
}

export default SnapshotManager
