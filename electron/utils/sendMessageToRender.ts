import EventType from 'Types/EventType'
import { BrowserWindow } from 'electron'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendMessageToRender = (eventType: EventType, payload: any) => {
  BrowserWindow.getAllWindows().forEach(window => {
    window.webContents.send(eventType, payload)
  })
}

export default sendMessageToRender
