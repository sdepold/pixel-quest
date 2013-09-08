window.PixelQuest.Game = (function() {
  "use strict"

  var Game = function() {
    this.canvas      = document.querySelector("canvas")
    this.ctx         = this.canvas.getContext('2d')
    this.objects     = {}
    this.environment = { sky: {}, sun: { offset: 0, direction: "decr" } }
  }

  Game.prototype.render = function(player) {
    var self = this

    this.setSize()
    this.ctx.fillStyle = "#FFE9DA"
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)


    renderSky.call(this, 240)
    renderMountains.call(this, 240, "#ffffff", 10)
    renderMountains.call(this, 240, "#beaea2", 9)
    renderMountains.call(this, 240, "#d8c6b8", 6)
    renderMountains.call(this, 240, "#FFE9DA", 3)
    renderSun.call(this)

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

  var renderSky = function(skyHeight) {
    var colors = ['#4494c6', '#4597cb', '#479bce', '#499ed3', '#499bd5', '#499cd6', '#4899d9', '#4898d9']
      , self   = this

    colors.forEach(function(color, i) {
      self.ctx.fillStyle = color
      self.ctx.fillRect(0, i * skyHeight / colors.length, window.innerWidth, skyHeight / colors.length)
    })
  }

  var renderMountains = function(skyHeight, color, levels) {
    var px     = 12
      , prev   = 1
      , height = 0
      , self   = this

    if (!this.environment.sky[color]) {
      this.environment.sky[color] = []

      for (var i = 0, x = ~~(window.innerWidth / px) + 1; i < x; i++) {
        if (Math.random() < 0.5) { prev++ }
        else if (Math.random() < 0.5) { prev-- }
        prev = Math.max(0, Math.min(prev, levels))
        this.environment.sky[color].push(prev)
      }
    }

    this.ctx.fillStyle = color
    this.environment.sky[color].forEach(function(height, i) {
      self.ctx.fillRect(i * px, skyHeight - height * px, px, height * px)
    })
  }

  var renderSun = function() {
    var px = 12

    if (this.environment.sun.offset > px) {
      this.environment.sun.direction = 'decr'
    } else if (this.environment.sun.offset < -px) {
      this.environment.sun.direction = 'incr'
    }

    if (this.environment.sun.direction === 'decr') {
      this.environment.sun.offset = this.environment.sun.offset - 0.05
    } else {
      this.environment.sun.offset = this.environment.sun.offset + 0.05
    }

    this.ctx.fillStyle = '#f1c40f'
    this.ctx.fillRect(
      px * 3 - this.environment.sun.offset / 2,
      px * 3 - this.environment.sun.offset / 2,
      px * 6 + this.environment.sun.offset,
      px * 6 + this.environment.sun.offset
    )
  }

  return Game
})()
