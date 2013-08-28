window.PixelQuest.Player = (function() {
  "use strict"

  var Player = function(id, options) {
    this.id      = id
    this.options = options || {}
  }

  Player.prototype.render = function(ctx) {
    ctx.fillStyle = "#F2D5C0"
    ctx.fillRect(this.options.x, this.options.y, 30, 30)
  }

  Player.prototype.move = function(direction, step) {
    step = step || this.options.stepSize

    switch (direction) {
      case 'left':
        this.options.x = this.options.x - step
        break
      case 'right':
        this.options.x = this.options.x + step
        break
      case 'up':
        this.options.y = this.options.y - step
        break
      case 'down':
        this.options.y = this.options.y + step
        break
    }
  }

  Player.prototype.toJSON = function() {
    var data = this.options
    data.id = this.id
    return data
  }

  Player.prototype.update = function(data) {
    this.options = data
  }

  return Player
})()
