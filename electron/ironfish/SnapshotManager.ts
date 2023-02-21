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

const MANIFEST_URL =
  'https://ironfish-snapshots.s3-accelerate.amazonaws.com/manifest.json'

class SnapshotManager implements IIronfishSnapshotManager {
  private node: IronfishNode
  private progress: ProgressType
  private filePath: string

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

  async start(pathToSave: string): Promise<void> {
    if (!this.node) {
      this.progress.hasError = true
      this.progress.error = 'Node is not initialized'
      return
    }
    const manifest = await this.manifest()
    if (manifest.database_version > VERSION_DATABASE_CHAIN) {
      this.progress.hasError = true
      this.progress.error =
        'Snapshot is used more actual database version. Please try to update application.'
      return
    }

    try {
      await fs.promises.mkdir(pathToSave, { recursive: true })
    } catch (e) {
      this.progress.hasError = true
      this.progress.error =
        'Cannot get access to selected folder. Please check the path and permissions.'
      return
    }

    const diskSpace = await checkDiskSpace(pathToSave)

    if (diskSpace.free < manifest.file_size * 2) {
      this.progress.hasError = true
      this.progress.error =
        "You don't have enougth free space in selected folder."
      return
    }

    await this.download(manifest, pathToSave)
    await this.clearDatabase()
    await this.unarchive()
    await this.clearTemporaryFiles()

    this.progress.status = ProgressStatus.COMPLETED
  }

  private async download(
    manifest: SnapshotManifest,
    pathToSave: string
  ): Promise<void> {
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
      pathToSave,
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
        this.progress.error = 'Cannot download snapshot'
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
      this.progress.error = 'Cannot unarchive snapshot'
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
      this.progress.error = 'Imposible to delete current chain database files.'
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
      this.progress.error = 'Imposible to clear temporary files.'
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
