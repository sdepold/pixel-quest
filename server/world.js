var Player  = require('./entities/player.js')
  , Monster = require('./entities/monster.js')

var World = module.exports = function() {
  var self = this

  this.players = {}
  this.monsters = {}

  setInterval(function() {
    if (self.getMonsters({ alive: true }).length < 10) {
      self.spawnMonsters()
    }
  }, 1000)
}

World.prototype.getPlayer = function(id, options) {
  var result = this.players[id]

  if (!result && (options || {}).create) {
    result = this.createPlayer(id)
  }

  return result
}

World.prototype.setPlayer = function(id, data) {
  this.players[id] = data
}

World.prototype.createPlayer = function(id) {
  var player = new Player(id)
  this.setPlayer(id, player)
  return player
}

World.prototype.updatePlayer = function(id, data) {
  var player = this.getPlayer(id)

  Object.keys(data).forEach(function(key) {
    player[key] = data[key]
  })

  this.setPlayer(id, player)
}

World.prototype.getMonster = function(id) {
  return this.monsters[id]
}

World.prototype.getMonsters = function(options) {
  var self = this

  options = options || {}

  return Object.keys(this.monsters).map(function(id) {
    return self.monsters[id]
  }).filter(function(monster) {
    if (options.alive) {
      monster.iterate()
      return monster.alive()
    } else {
      monster.iterate()
      return monster
    }
  })
}

World.prototype.findAttackableMonsters = function(player) {
  var maxRange = 30

  if (player.options.renderOptions.weapon.side === 'left') {
    // the player walks to the left
    return this.getMonsters().filter(function(monster) {
      var rightX = monster.options.x + monster.options.width + monster.options.renderOptions.pixelSize * 2

      return (
        // left side of the player is on the right of monster
        ((player.options.x - maxRange) < rightX) &&

        // right side of the player is on the right of the monster
        (rightX < (player.options.x + player.options.renderOptions.width)) &&

        // player is on the same height as the monster
        (monster.options.y < player.options.y) &&
        (monster.options.y + monster.options.height > player.options.y)
      )
    })
  } else {
    // the player walks to the right
    return this.getMonsters().filter(function(monster) {
      var rightX = player.options.x + player.options.renderOptions.width + player.options.renderOptions.pixelSize * 3

      return (
        // left side of the monster is on the right of player
        ((monster.options.x - maxRange) < (player.options.x + maxRange)) &&

        // right side of the monster is on the right of the player
        (rightX < (monster.options.x + monster.options.width)) &&

        // player is on the same height as the monster
        (monster.options.y < player.options.y) &&
        (monster.options.y + monster.options.height > player.options.y)
      )
    })
  }
}

World.prototype.spawnMonsters = function() {
  var monster = new Monster()
  this.monsters[monster.id] = monster
}

World.prototype.getOtherPlayers = function(id) {
  var self = this

  return Object.keys(this.players).map(function(playerId) {
    var player = self.getPlayer(playerId)

    if ((player.id != id) && player.options.online) {
      return player
    }
  }).filter(function(player) {
    return !!player
  })
}

World.prototype.getSyncData = function(playerIdOfSocket) {
  return {
    Player:  this.getOtherPlayers(playerIdOfSocket),
    Monster: this.getMonsters({ alive: true })
  }
}
