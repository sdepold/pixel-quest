window.PixelQuest.Player = (function() {
  "use strict"

  var Player = function(x, y, options) {
    this.x       = x
    this.y       = y
    this.options = options || {}
  }

  Player.prototype.render = function(ctx) {
    ctx.fillStyle = "#F2D5C0"
    ctx.fillRect(this.x, this.y, 30, 30)
  }

  Player.prototype.toJSON = function() {
    var data = this.options

    data.x = this.x
    data.y = this.y

    return data
  }

  return Player
})()
