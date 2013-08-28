var World = module.exports = function() {
  this.players = {}
  this.monsters = {}
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
