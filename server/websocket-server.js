var io    = require('socket.io')
  , World = require('./world.js')
  , Player = require('./entities/player.js')
  , Utils  = require('./utils')

var WebSocket = module.exports = function(server) {
  this.server  = server
  this.io      = null
  this.sockets = {}
  this.world   = new World()
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
  }, 10)
}

WebSocket.prototype.observeEvents = function(socket) {
  var self = this

  this.events = {
    'player#update': function(data) {
      var player = this.world.getPlayer(data.id)

      if (!!player) {
        delete data.options.renderOptions.experience
        delete data.options.renderOptions.levelUp
        player.options = Utils.extend(player.options, data.options, ['x', 'y', 'attacking', 'renderOptions'])
      }
    },

    'disconnect': function() {
      // console.log('Player', socket.playerId, 'just quit the game.')
      var player = this.world.getPlayer(socket.playerId)

      if (!!player) {
        // player.options = Utils.extend(player.options, {
        //   online:       false,
        //   offlineSince: +new Date()
        // })
      }
    },

    'player#join': function(data) {
      socket.playerId       = data.id
      this.sockets[data.id] = socket

      var player = this.world.getPlayer(data.id, { create: true })

      player.options = Utils.extend(player.options, {
        online:       true,
        offlineSince: null
      })

      socket.emit('player#joined', player)
    },

    'player#attack': function(playerId) {
      var player = this.world.getPlayer(playerId)

      if (player) {
        this.world.findAttackableMonsters(player).forEach(function(monster) {
          if (monster.alive()) {
            monster.hit(player.options.strength, player.options.renderOptions.weapon.side)

            if (!monster.alive()) {
              var stats = player.killedMonster(monster)

              self.broadcast('monster#killed', monster)
              self.broadcast('player#experience', player, stats.experience)

              if (stats.achievement.done) {
                self.broadcast('player#experience', player, stats.achievement.experience)
              }

              if (stats.levelUp) {
                self.broadcast('player#levelUp', player)
              }

              socket.emit('player#update', player)
            }
          }
        })
      }
    }
  }

  Object.keys(this.events).forEach(function(eventName) {
    socket.on(eventName, function() {
      // console.log('Received event', eventName, 'with the following arguments', arguments)
      self.events[eventName].apply(self, arguments)
    })
  })
}

WebSocket.prototype.broadcast = function() {
  var args = [].slice.call(arguments)
    , self = this

  Object.keys(this.sockets).forEach(function(playerIdOfSocket) {
    var socket = self.sockets[playerIdOfSocket]
    socket.emit.apply(socket, args)
  })
}


WebSocket.prototype.syncWorld = function() {
  var self = this

  Object.keys(this.sockets).forEach(function(playerIdOfSocket) {
    var player = self.world.getPlayer(playerIdOfSocket)
      , socket = self.sockets[playerIdOfSocket]
      , data   = self.world.getSyncData(playerIdOfSocket)

    if (player.checkForAttacks(data.Monster)) {
      // the player has been hit and needs an update
      socket.emit('player#update', player)
    }


    // console.log('Emitting world#sync with the following arguments', players)

    Object.keys(data).forEach(function(klass) {
      socket.emit('world#sync', klass, data[klass])
    })
  })
}
