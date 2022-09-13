import { contextBridge } from 'electron'
import DemoDataManager from '../src/data/DemoDataManager'

contextBridge.exposeInMainWorld('DemoDataManager', new DemoDataManager())
