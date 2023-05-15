import path from 'path'
import os from 'os'

const getAppHomeFolder = () => {
  return path.join(os.homedir(), '/.ironfish/node-app')
}

export default getAppHomeFolder
