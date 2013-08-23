window.PixelQuest.Game = (function() {
  "use strict"

  var Game = function() {
    this.canvas = document.querySelector("canvas")
    this.ctx    = this.canvas.getContext('2d')

    this.player = new Player()

    this.canvas.width  = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  Game.initialize = function() {
    var game = new Game()

    setInterval(function() {
      game.render()
    }, 10)
  }

  Game.prototype.render = function() {
    this.ctx.fillStyle = "#FFE9DA"
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    this.player.render(this.ctx)
  }

  return Game
})()
