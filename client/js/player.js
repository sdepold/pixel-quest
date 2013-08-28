window.PixelQuest.Player = (function() {
  "use strict"

  var Player = function(id, options) {
    this.id             = id
    this.isActivePlayer = (id === window.PixelQuest.Player.getIdentifier())
    this.options        = options || {}
    this.renderOptions  = {
      color:          "#F2D5C0",
      arrowOffset:    0,
      arrowDirection: "up",
      width:          30,
      height:         30
    }
  }

  Player.getIdentifier = function() {
    var cookies = {}

    ;(document.cookie || "").split(';').forEach(function(pair) {
      var split = pair.split("=")
      if (split[0]) {
        cookies[split[0].trim()] = split[1].trim()
      }
    })

    return cookies.PixelQuestIdentifier
  }

  Player.setIdentifier = function(id) {
    document.cookie = 'PixelQuestIdentifier=' + id + '; expires=Tue, 1 Jan 2030 00:00:00 UTC; path=/'
  }

  Player.generateIdentifier = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    })
  }

  Player.prototype.render = function(ctx) {
    ctx.fillStyle = this.renderOptions.color

    ctx.fillRect(
      this.options.x,
      this.options.y,
      this.renderOptions.width,
      this.renderOptions.height
    )

    if (this.isActivePlayer) {
      renderArrow.call(this, ctx)
    }
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

  // private

  var renderArrow = function(ctx) {
    var width = 4

    ctx.fillRect(
      this.options.x + this.renderOptions.width / 2 - width / 2,
      this.options.y - width * 2 - parseInt(this.renderOptions.arrowOffset),
      width, width
    )

    ctx.fillRect(
      this.options.x + this.renderOptions.width / 2 - width / 2 - width,
      this.options.y - width * 2 - parseInt(this.renderOptions.arrowOffset) - width,
      width, width
    )

    ctx.fillRect(
      this.options.x + this.renderOptions.width / 2 - width / 2 + width,
      this.options.y - width * 2 - parseInt(this.renderOptions.arrowOffset) - width,
      width, width
    )

    if (this.renderOptions.arrowOffset === 5) {
      this.renderOptions.arrowDirection = 'down'
    } else if (this.renderOptions.arrowOffset === 0) {
      this.renderOptions.arrowDirection = 'up'
    }

    if (this.renderOptions.arrowDirection === 'up') {
      this.renderOptions.arrowOffset = this.renderOptions.arrowOffset + 0.25
    } else {
      this.renderOptions.arrowOffset = this.renderOptions.arrowOffset - 0.25
    }
  }

  return Player
})()
