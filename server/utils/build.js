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

var targetFolder = __dirname + '/../../dist'
  , scripts      = []

var createTargetFolder = function() {
  exec('rm -rf ' + targetFolder)
  exec('mkdir -p ' + targetFolder)
  exec("mkdir -p " + targetFolder + "/client")
  exec("mkdir -p " + targetFolder + "/server/entities")
}

var copySources = function() {
  exec('cp -rf ' + __dirname + '/../* ' + targetFolder + '/server/')
  exec('cp -rf ' + __dirname + '/../../client/index.html ' + targetFolder + '/client/index.html')
  exec('rm -rf ' + targetFolder + '/server/utils')
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
      if ((row.indexOf('src=') === -1) || (row.indexOf('socket') !== -1)) {
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
  var paths = scripts.map(function(file) { return __dirname + '/../../client' + file })
  fs.writeFileSync(targetFolder + '/client/pixel-quest.js', UglifyJS.minify(paths).code);

  paths = exec('ls -1 ' + __dirname + "/../").split('\n')

  paths.forEach(function(path) {
    if ((path === 'utils') || (path === 'package.json')) {
      return
    }

      if (path === 'entities') {
        _paths = exec('ls -1 ' + __dirname + '/../entities').split('\n')

        _paths.forEach(function(_path) {
          var content = UglifyJS.minify(__dirname + '/../entities/' + _path).code
          fs.writeFileSync(targetFolder + '/server/entities/' + _path, content)
        })
      } else {
        var content = UglifyJS.minify(__dirname + '/../' + path).code
        fs.writeFileSync(targetFolder + '/server/' + path, content)
      }
  })
}

var compresCssFiles = function() {
  var yuiCall = 'node ' + __dirname + '/../../node_modules/yuicompressor/nodejs/cli.js'
  exec(yuiCall + ' --type css -o ' + targetFolder + '/client/pixel-quest.css ' + __dirname + '/../../client/css/screen.css')
}

createTargetFolder()
copySources()
modifyIndexHtml()
compressJsFiles()
compresCssFiles()
