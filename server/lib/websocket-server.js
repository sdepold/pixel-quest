var io = require('socket.io')

var WebSocket = module.exports = function(server) {
  this.server = server
  this.io     = null
}

WebSocket.prototype.listen = function() {
  this.io = io.listen(this.server.httpServer)

  this.io.sockets.on('connection', function (socket) {
    this.socket = socket
    this.observeEvents()
  }.bind(this))
}

WebSocket.prototype.observeEvents = function() {
  var events = {
    'player#join': 'onPlayerJoin'
  }

  Object.keys(events).forEach(function(eventName) {
    this.socket.on(eventName, this[events[eventName]].bind(this))
  }.bind(this))
}

WebSocket.prototype.onPlayerJoin = function(data) {
  this.socket.emit('player#joined', { x: 50, y: 70, movementDelay: 50 })
}
