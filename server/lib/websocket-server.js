var io = require('socket.io')

var WebSocket = module.exports = function(server) {
  this.server = server
  this.io     = null
  this.db     = {
    players: {}
  }
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
    'player#join': 'onPlayerJoin',
    'player#update': 'onPlayerUpdate'
  }

  Object.keys(events).forEach(function(eventName) {
    this.socket.on(eventName, this[events[eventName]].bind(this))
  }.bind(this))
}

WebSocket.prototype.onPlayerJoin = function(data) {
  if (!this.db.players[data.id]) {
    this.db.players[data.id] = { x: 50, y: 70, movementDelay: 50 }
  }

  this.socket.emit('player#joined', this.db.players[data.id])
}

WebSocket.prototype.onPlayerUpdate = function(data) {
  if (this.db.players[data.id]) {
    this.db.players[data.id] = data
  }
}
