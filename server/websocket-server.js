var io     = require('socket.io')
  , World  = require('./world.js')
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
  this.io.sockets.on('connection', function (socket) {
    var uuid = Utils.generateIdentifier()

    Utils.log("Generated uuid " + uuid)
    socket.emit('uuid', Utils.lzw_encode(uuid))
    self.observeEvents(uuid, socket)
  })
  this.io.set('log level', 1)

  setInterval(function() {
    self.checkForDisconnectedClients()
    self.world.iterate()
    self.syncWorld()
  }, 10)
}

WebSocket.prototype.observeEvents = function(uuid, socket) {
  var self = this

  socket.playerId    = uuid
  this.sockets[uuid] = socket

  this.events = {
    'player#update': function(data) {
      data = JSON.parse(Utils.lzw_decode(data))
      var player = this.world.getPlayer(data.id)

      if (!!player) {
        delete data.options.renderOptions.experience
        delete data.options.renderOptions.damages
        delete data.options.renderOptions.levelUp
        delete data.options.online

        player.updatedAt = +new Date()
        player.options = Utils.extend(player.options, data.options, ['x', 'y', 'attacking', 'renderOptions'])
      }
    },

    'player#join': function(playerId) {
      playerId = Utils.lzw_decode(playerId)

      var player = self.world.getPlayer(playerId, { create: true })

      player.options = Utils.extend(player.options, {
        online:       true,
        offlineSince: null
      })

      Utils.log('Player joined '+ uuid)
      this.sockets[playerId].emit('player#joined', Utils.lzw_encode(JSON.stringify(player)))
    },

    'player#resurrect': function(playerId) {
      playerId = Utils.lzw_decode(playerId)

      var player = this.world.getPlayer(playerId)

      if (!!player) {
        player.resurrect()

        socket.emit('player#update', Utils.lzw_encode(JSON.stringify(player)))
        socket.emit('player#reset', Utils.lzw_encode(playerId))
      }
    },

    'player#attack': function(playerId) {
      playerId = Utils.lzw_decode(playerId)

      var player = this.world.getPlayer(playerId)

      if (player) {
        this.world.findAttackableMonsters(player).forEach(function(monster) {
          if (monster.alive()) {
            monster.hit(player.options.strength, player.options.renderOptions.weapon.side)

            if (!monster.alive()) {
              var stats = player.killedMonster(monster)

              self.broadcast('monster#killed', Utils.lzw_encode(JSON.stringify(monster)))
              self.broadcast(
                'player#experience',
                Utils.lzw_encode(JSON.stringify(player)),
                Utils.lzw_encode(stats.experience)
              )

              if (stats.achievement.done) {
                self.broadcast(
                  'player#experience',
                  Utils.lzw_encode(JSON.stringify(player)),
                  Utils.lzw_encode(stats.achievement.experience)
                )
              }

              if (stats.levelUp) {
                self.broadcast('player#levelUp', Utils.lzw_encode(JSON.stringify(player)))
              }

              socket.emit('player#update', Utils.lzw_encode(JSON.stringify(player)))
            }
          }
        })
      }
    }
  }

  Object.keys(this.events).forEach(function(eventName) {
    self.sockets[uuid].on(eventName, function() {
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


WebSocket.prototype.checkForDisconnectedClients = function() {
  var self = this

  Object.keys(this.world.players).forEach(function(playerId) {
    var player = self.world.getPlayer(playerId)

    if (player.options.online && (Math.abs(+new Date() - player.updatedAt) > 10000)) {
      Utils.log('Player ' + playerId + ' just quit the game.')

      player.options.online = false
      self.broadcast('player#quit', Utils.lzw_encode(player.id))
      self.world.removePlayer(playerId)
    }
  })
}

WebSocket.prototype.syncWorld = function() {
  var self = this

  Object.keys(this.sockets).forEach(function(playerIdOfSocket) {
    var player = self.world.getPlayer(playerIdOfSocket)
      , socket = self.sockets[playerIdOfSocket]
      , data   = self.world.getSyncData(playerIdOfSocket)

    if (player && player.options.hp > 0) {
      var hitBy  = player.checkForAttacks(data.Monster)

      if (!!hitBy) {
        // the player has been hit and needs an update
        socket.emit('player#update', Utils.lzw_encode(JSON.stringify(player)))

        if (player.options.hp <= 0) {
          socket.emit('player#died', Utils.lzw_encode(player.id))
        } else {
          socket.emit('player#hit', Utils.lzw_encode(player.id), Utils.lzw_encode(hitBy.options.damage))
        }
      }
    }

    // console.log('Emitting world#sync with the following arguments', players)

    Object.keys(data).forEach(function(klass) {
      socket.emit('world#sync', Utils.lzw_encode(klass), Utils.lzw_encode(JSON.stringify(data[klass])))
    })
  })
}
