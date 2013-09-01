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

World.prototype.spawnMonsters = function() {
  var generateIdentifier = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    })
  }

  var width = 30 + (Math.random() * 30)

  width = width - (width % 6)

  var data = {
    id:     generateIdentifier(),
    x:      Math.random() * 1000,
    y:      Math.random() * 1000,
    height: width,
    width:  width,
    color:  '#' + (Math.random().toString(16) + '000000').slice(2, 8)
  }

  this.monsters[data.id] = data
}
