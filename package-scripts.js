// eslint-disable-next-line @typescript-eslint/no-var-requires
const { series, concurrent, crossEnv } = require('nps-utils')
const PORT = process.env.PORT || 4000

module.exports = {
  scripts: {
    wait: {
      http: `wait-on http://localhost:${PORT}`,
      tcp: `wait-on tcp:${PORT}`,
    },
    start: {
      raw: 'react-scripts start',
      dev: crossEnv(`BROWSER=none PORT=${PORT} nps start.raw`),
    },
    ts: {
      electron: 'tsc -p electron',
      watch: 'nps "ts.electron -w"',
    },

    build: 'react-scripts build',
    test: 'react-scripts test',
    electron: {
      base: 'electron .',
      // dev: 'concurrently "cross-env BROWSER=none yarn start" "wait-on http://localhost:3000 && tsc -p electron -w" "wait-on http://localhost:3000 && tsc -p electron && electron ."',
      dev: concurrent({
        dev: 'nps start.dev',
        electron: series.nps('wait.tcp', 'electron.base'),
      }),
      build: series('nps build', 'nps ts.electron', 'electron-builder'),
    },
    postinstall: 'electron-builder install-app-deps',
  },
}
