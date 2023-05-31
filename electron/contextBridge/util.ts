import { ipcRenderer } from 'electron'

export async function invoke(channel: string, ...args: any[]): Promise<any> {
  try {
    const response = await ipcRenderer.invoke(channel, ...args)
    if (response?.error) {
      throw response
    }

    return response
  } catch (error) {
    return new Promise((_, reject) => reject(error))
  }
}
