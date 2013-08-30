var execSync = require('exec-sync')
  , fs       = require('fs')
  , UglifyJS = require("uglify-js")

var exec = function(cmd, showStdOut) {
  console.log(cmd)

  var result = execSync(cmd)

  if(showStdOut) {
    console.log(result)
  }

  return result
}

var targetFolder = __dirname + '/../dist'
  , scripts      = []

var createTargetFolder = function() {
  exec('rm -rf ' + targetFolder)
  exec('mkdir -p ' + targetFolder)
  exec("mkdir -p " + targetFolder + "/client")
  exec("mkdir -p " + targetFolder + "/server")
  exec("mkdir -p " + targetFolder + "/node_modules")
}

var copySources = function() {
  exec('cp -rf ' + __dirname + '/../server/* ' + targetFolder + '/server/')
  exec('cp -rf ' + __dirname + '/../client/index.html ' + targetFolder + '/client/index.html')
  exec('cp -f ' + __dirname + '/../app.js ' + targetFolder + '/')
  exec('cp -f ' + __dirname + '/../package.json ' + targetFolder + '/')
  exec('cp -rf ' + __dirname + '/../node_modules/socket.io ' + targetFolder + '/node_modules/')
}

var modifyIndexHtml = function() {
  var indexHTML = exec('cat ' + targetFolder + '/client/index.html')

  indexHTML = indexHTML.split('\n').map(function(row) {
    if(row.indexOf('<link') !== -1) {
      // the row contains a link tag
      return row.replace('css/screen.css', 'pixel-quest.css')
    } else if(row.indexOf('<script') === -1) {
      // the row does not contain a script tag
      return row
    } else {
      // the row contains a script tag
      if (process.env.SKIP_PREFIXFREE && (row.indexOf('prefixfree') !== -1)) {
        return null
      } else if ((row.indexOf('src=') === -1) || (row.indexOf('socket') !== -1)) {
        return row
      } else {
        scripts.push(row.match(/src="(.*)"/)[1])
        return null
      }
    }
  }).filter(function(row) {
    return row !== null
  }).join('\n').replace('</head>', '  <script src="/pixel-quest.js"></script>\n  </head>')

  fs.writeFileSync(targetFolder + '/client/index.html', indexHTML)
}

var compressJsFiles = function() {
  var paths = scripts.map(function(file) { return __dirname + '/../client' + file })
  fs.writeFileSync(targetFolder + '/client/pixel-quest.js', UglifyJS.minify(paths).code);

  paths = exec('ls -1 ' + __dirname + '/../server/').split('\n')
  paths.forEach(function(path) {
    fs.writeFileSync(targetFolder + '/server/' + path, UglifyJS.minify(__dirname + '/../server/' + path).code)
  })
}

var compresCssFiles = function() {
  var yuiCall = 'node ' + __dirname + '/../node_modules/yuicompressor/nodejs/cli.js'
  exec(yuiCall + ' --type css -o ' + targetFolder + '/client/pixel-quest.css ' + __dirname + '/../client/css/screen.css')
}

createTargetFolder()
copySources()
modifyIndexHtml()
compressJsFiles()
compresCssFiles()
