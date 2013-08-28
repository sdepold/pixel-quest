var io = require('socket.io')

var WebSocket = module.exports = function(server) {
  this.server  = server
  this.io      = null
  this.sockets = {}
  this.db      = {
    players: {}
  }
}

WebSocket.prototype.listen = function() {
  var self = this

  this.io = io.listen(this.server.httpServer)
  this.io.set('log level', 1);

  this.io.sockets.on('connection', function (socket) {
    self.observeEvents(socket)
  })

  setInterval(function() {
    self.syncWorld()
  }, 100)
}

WebSocket.prototype.observeEvents = function(socket) {
  var self   = this

  this.events = {
    'player#update': function(data) {
      if (this.db.players[data.id]) {
        this.db.players[data.id] = data
      }
    },

    'disconnect': function(data) {
      if (this.db.players[data.id]) {
        this.db.players[data.id].online = false
        this.db.players[data.id].offlineSince = +new Date()
      }
    },

    'player#join': function(data) {
      this.sockets[data.id] = socket

      if (!this.db.players[data.id]) {
        this.db.players[data.id] = { x: 50, y: 70, movementDelay: 50, stepSize: 5 }
      }

      this.db.players[data.id].online       = true
      this.db.players[data.id].offlineSince = null
      this.db.players[data.id].id           = data.id

      socket.emit('player#joined', this.db.players[data.id])
    }
  }

  Object.keys(this.events).forEach(function(eventName) {
    socket.on(eventName, function() {
      console.log('Received event', eventName, 'with the following arguments', arguments)
      self.events[eventName].apply(self, arguments)
    })
  })
}


WebSocket.prototype.syncWorld = function() {
  var self = this

  Object.keys(this.sockets).forEach(function(playerIdOfSocket) {
    var socket = self.sockets[playerIdOfSocket]

    Object.keys(self.db.players).forEach(function(playerId) {
      if (playerId != playerIdOfSocket) {
        var player = self.db.players[playerId]

        if (player.online || ((+new Date - player.offlineSince) < 5000)) {
          console.log('Emitting world#sync with the following arguments', player)
          socket.emit('world#sync', 'Player', player)
        }
      }
    })
  })
}
