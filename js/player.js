window.PixelQuest.Player = (function() {
  "use strict"

  var Player = function() {
    this.x = 10
    this.y = 10
  }

  Player.prototype.render = function(ctx) {
    ctx.fillStyle = "#F2D5C0"
    ctx.fillRect(this.x, this.y, 30, 30)
  }

  return Player
})()
