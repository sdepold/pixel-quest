var http  = require('http')
  , fs    = require('fs')
  , utils = require('./utils.js')

var Server = module.exports = function() {
  this.httpServer = http.createServer(function (req, res) {
    this.onRequest(req, res)
  }.bind(this))
}

Server.prototype.onRequest = function(req, res) {
  utils.log("Request: " + req.url)

  res.writeHead(200, { 'Content-Type': utils.contentTypeForUrl(req.url) })

  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': utils.contentTypeForUrl(req.url) })
    res.end(fs.readFileSync(__dirname + '/../client/index.html'))
  } else {
    try {
      var content = fs.readFileSync(__dirname + "/../client" + req.url)
      res.writeHead(200, { 'Content-Type': utils.contentTypeForUrl(req.url) })
      res.end(content)
    } catch (e) {
      res.writeHead(404)
      res.end()
    }
  }
}

Server.prototype.listen = function(port) {
  this
    .httpServer
    .listen(port, function() {
      console.log("Started pixel-quest on http://localhost:%d.", port)
    })
}
