import { ipcRenderer } from 'electron'
import log from 'electron-log'

export async function invoke(channel: string, ...args: any[]): Promise<any> {
  try {
    const response = await ipcRenderer.invoke(channel, ...args)

    if (typeof response?.error !== 'boolean') {
      log.warn(`Expected 'error' field on IPC response.`)
    }

    if (response?.error) {
      throw response
    }

    return response?.data
  } catch (error) {
    return new Promise((_, reject) => reject(error))
  }
}
