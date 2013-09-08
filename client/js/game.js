window.PixelQuest.Game = (function() {
  "use strict"

  var Game = function() {
    this.canvas  = document.querySelector("canvas")
    this.ctx     = this.canvas.getContext('2d')
    this.objects = {}
  }

  Game.prototype.render = function(player) {
    var self = this

    this.setSize()
    this.ctx.fillStyle = "#FFE9DA"
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    Object.keys(this.objects).forEach(function(objectId) {
      self.objects[objectId].render(self.ctx)
    })

    renderInfoBar.call(this, player)
  }

  Game.prototype.setSize = function() {
    this.canvas.width  = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  Game.prototype.addObject = function(object) {
    this.objects[object.id] = object
  }

  Game.prototype.getObject = function(id) {
    return this.objects[id]
  }

  Game.prototype.removeObject = function(object) {
    delete this.objects[object.id]
  }

  /////////////
  // private //
  /////////////

  var renderInfoBar = function(player) {
    var y     = window.innerHeight - 40
      , textY = y + 28

    this.ctx.fillStyle = '#2980b9'
    this.ctx.fillRect(0, y, window.innerWidth, 40)

    if (!!player) {
      this.ctx.font = "bold 22px sans-serif"
      this.ctx.fillStyle = "#FFE9DA"
      this.ctx.textAlign = 'left'

      var text = [
        "Level: " + player.object.options.experience.level,
        "HP: " + 10,
        "XP: " + player.object.options.experience.current + "/" + player.object.options.experience.neededForLevelUp
      ].join("      ")

      this.ctx.fillText(text, 10, textY)

      this.ctx.textAlign = 'right'
      this.ctx.fillText(
        [
          "Kill",
          player.object.options.achievements.current.needed - player.object.options.achievements.current.achieved,
          player.object.options.achievements.current.colorName,
          'monsters.'
        ].join(" "),
        window.innerWidth - 10,
        textY
      )

      this.ctx.textAlign = 'left'
    }
  }

  return Game
})()
