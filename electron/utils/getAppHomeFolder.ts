import path from 'path'
import os from 'os'

const getAppHomeFolder = (...paths: string[]) => {
  return path.join(os.homedir(), '/.ironfish/node-app', ...paths)
}

export default getAppHomeFolder
