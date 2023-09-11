/* eslint-disable */
/**
 * Mock implementation of an update server for testing Windows app auto-updating.
 * The updater should attempt to download the update, but it will currently error with "incorrect checksum".
 * 
 * You'll need to change UpdateManager's serverUrl to point to this server, then produce a Windows build of the app 
 * with the change. (The auto-updating won't run unless wrapped with Squirrel, so no dev mode.)
 * 
 * Run with `node demo-update-server.js`
 */
const http = require('http')

const server = http.createServer((req, res) => {
  console.log('new request:', req.url)
  res.statusCode = 200
  if (req.url.includes('notes')) {
    res.setHeader('Content-Type', 'application/json')
    res.end(
      `{"data":[{"version":"v1.0.3","name":"Version 1.0.3","date":"2023-09-03T15:32:52Z","notes":"","prevVersion":"v1.0.2","nextVersion":null}],"metadata":{"month_range":[{"month":"September 2023","version":"v1.0.3"}],"has_next":true,"has_prev":false}}`
    )
  } else {
    res.end(
      `169EDD50098860BF44F00CDE8121418EA2083475 node_app-1.0.3-full.nupkg 281682835`
    )
  }
})

server.listen(3222, '127.0.0.1')
