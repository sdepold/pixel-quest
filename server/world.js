var Monster = require('./entities/monster.js')

var World = module.exports = function() {
  var self = this

  this.players = {}
  this.monsters = {}

  setInterval(function() {
    if (Object.keys(self.monsters).length < 10) {
      self.spawnMonsters()
    }
  }, 1000)
}

World.prototype.getPlayer = function(id) {
  return this.players[id]
}

World.prototype.setPlayer = function(id, data) {
  this.players[id] = data
}

World.prototype.createPlayer = function(id) {
  this.setPlayer(id, {
    x:             50,
    y:             70,
    movementDelay: 50,
    stepSize:      5
  })
}

World.prototype.updatePlayer = function(id, data) {
  var player = this.getPlayer(id)

  Object.keys(data).forEach(function(key) {
    player[key] = data[key]
  })

  this.setPlayer(id, player)
}

World.prototype.getMonsters = function() {
  var self = this

  return Object.keys(this.monsters).map(function(id) {
    return self.monsters[id].iterate()
  })
}

World.prototype.spawnMonsters = function() {
  var monster = new Monster()
  this.monsters[monster.id] = monster
}

World.prototype.getSyncData = function(playerIdOfSocket) {
  var self = this

  var players = Object.keys(this.players).map(function(playerId) {
    var player = self.getPlayer(playerId)

    if ((player.id != playerIdOfSocket) && player.online) {
      return player
    }
  }).filter(function(player) {
    return !!player
  })

  return {
    Player:  players,
    Monster: this.getMonsters()
  }
}
