import {
  IIronfishSnapshotManager,
  ProgressStatus,
  ProgressType,
} from 'Types/IronfishManager/IIronfishSnapshotManager'

class DemoSnapshotManager implements IIronfishSnapshotManager {
  stat: Omit<ProgressType, 'statistic'>
  async start(pathToSave: string) {
    this.execute(ProgressStatus.DOWLOADING)
  }
  private async execute(status: ProgressStatus) {
    this.stat = {
      status: status,
      current: 0,
      total: 378965234,
      estimate: 0,
      hasError: false,
      error: undefined,
    }
    if (status === ProgressStatus.COMPLETED) {
      return
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
