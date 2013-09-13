var execSync = require('exec-sync')

var exec = function(cmd, showStdOut) {
  console.log(cmd)

  var result = execSync(cmd, true)

  if(showStdOut) {
    console.log(result)
  }

  return result.stdout
}

exec('cd ' + __dirname + '/..; npm run build-zip')

var sizeClient = exec('cd ' + __dirname + '/../..; ls -ila client.zip').split(/ /g).filter(function(i) {
  return i !== ''
})[5]

var sizeServer = exec('cd ' + __dirname + '/../..; ls -ila server.zip').split(/ /g).filter(function(i) {
  return i !== ''
})[5]

exec('cd ' + __dirname + '/../..; rm dist*.zip')

console.log('Size of client zipfile: ', sizeClient)
console.log('Left: ', 13312 - sizeClient)
console.log()
console.log('Size of server zipfile: ', sizeServer)
console.log('Left: ', 13312 - sizeServer)
