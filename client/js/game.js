window.PixelQuest.Game = (function() {
  "use strict"

  var Game = function() {
    this.canvas      = document.querySelector("canvas")
    this.ctx         = this.canvas.getContext('2d')
    this.renderables = []
  }

  Game.prototype.render = function() {
    var self = this

    this.setSize()
    this.ctx.fillStyle = "#FFE9DA"
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    this.renderables.forEach(function(renderable) {
      renderable.render(self.ctx)
    })
  }

  Game.prototype.setSize = function() {
    this.canvas.width  = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  return Game
})()
