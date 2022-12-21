import { Meter } from '@ironfish/sdk'

export enum IronfishSnaphotManagerAction {
  START = 'start',
  STATUS = 'status',
  RESET = 'reset',
}

export enum ProgressStatus {
  NOT_STARTED,
  DOWLOADING,
  CLEARING_CHAIN_DB,
  UNARHIVING,
  CLEARING_TEMP_DATA,
  COMPLETED,
}

export interface ProgressType {
  status: ProgressStatus
  statistic: Meter
  total: number
  current: number
  estimate: number
  hasError: boolean
  error?: string
}

export type SnapshotManifest = {
  block_sequence: number
  checksum: string
  file_name: string
  file_size: number
  timestamp: number
  database_version: number
}

export interface IIronfishSnapshotManager {
  start: (pathToSave: string) => Promise<void>
  reset: () => Promise<void>
  status: () => Promise<Omit<ProgressType, 'statistic'>>
}
