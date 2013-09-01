window.PixelQuest.Player = (function() {
  "use strict"

  var Player = function(id, options) {
    this.id             = id
    this.isActivePlayer = (id === window.PixelQuest.Player.getIdentifier())
    this.options        = PixelQuest.Utils.extend({
      x: 0,
      y: 0,
      stepSize: 10,
      attacking: false
    }, options || {}),
    this.renderOptions  = {
      colors: {
        outline: "#F2D5C0",
        face:    "#FFFFFF"
      },
      width: 21,
      height: 14,
      pixelSize: 3,
      feet: {
        direction: 'down',
        offset: 0
      },
      weapon: {
        side: 'right',
        direction: 'up',
        angle: 0
      }
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
    renderBody.call(this, ctx)
    renderArms.call(this,ctx)
    renderWeapon.call(this, ctx)
    renderHair.call(this, ctx)
    renderFeet.call(this, ctx)
  }

  Player.prototype.attack = function() {
    if (!this.options.attacking) {
      this.options.attacking = true
    }
  }

  Player.prototype.move = function(direction, step) {
    step = step || this.options.stepSize

    switch (direction) {
      case 'left':
        this.options.x = this.options.x - step
        this.renderOptions.weapon.side = 'left'
        break
      case 'right':
        this.options.x = this.options.x + step
        this.renderOptions.weapon.side = 'right'
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
    return PixelQuest.Utils.extend(this.options, { id: this.id })
  }

  Player.prototype.update = function(data) {
    this.options = data

    if (this.options.attacking === false) {
      this.renderOptions.weapon.angle = 0
    }
  }

  // private

  var renderBody = function(ctx) {
    var px = this.renderOptions.pixelSize
      , y  = this.options.y + ~~this.renderOptions.feet.offset

    ctx.fillStyle = this.renderOptions.colors.outline

    ctx.fillRect(this.options.x, y, this.renderOptions.width, this.renderOptions.height)
    ctx.fillRect(this.options.x + px, y - px, this.renderOptions.width - px * 2, px)
    ctx.fillRect(
      this.options.x + px,
      y + this.renderOptions.height,
      this.renderOptions.width - px * 2,
      px
    )

    // face
    ctx.fillStyle = this.renderOptions.colors.face
    ctx.fillRect(
      this.options.x + px,
      y,
      this.renderOptions.width - px * 2,
      this.renderOptions.height - px
    )

    // eyes
    ctx.fillStyle = this.renderOptions.colors.outline
    ctx.fillRect(this.options.x + px * 2, y + px, px, px)
    ctx.fillRect(this.options.x + this.renderOptions.width - px * 3, y + px, px, px)
  }

  var renderArms = function(ctx) {
    var px = this.renderOptions.pixelSize
      , y  = this.options.y + ~~this.renderOptions.feet.offset

    ctx.fillStyle = this.renderOptions.colors.outline

    // left
    ctx.fillRect(this.options.x - px * 2, y + px * 2, px * 2, px)
    ctx.fillRect(this.options.x - px * 2, y + px, px, px)

    // right
    ctx.fillRect(this.options.x + this.renderOptions.width, y + px * 2, px * 2, px)
    ctx.fillRect(this.options.x + this.renderOptions.width + px, y + px, px, px)
  }

  var renderFeet = function(ctx) {
    var px         = this.renderOptions.pixelSize
      , y          = this.options.y + ~~this.renderOptions.feet.offset
      , feetLength = ~~((this.renderOptions.height + px * 2) / 2)

    ctx.fillStyle = this.renderOptions.colors.outline

    ctx.fillRect(this.options.x + px * 2, y + this.renderOptions.height, px, feetLength - ~~this.renderOptions.feet.offset)
    ctx.fillRect(this.options.x + this.renderOptions.width - px * 3, y + this.renderOptions.height, px, feetLength - ~~this.renderOptions.feet.offset)

    if (this.renderOptions.feet.direction === 'up') {
      this.renderOptions.feet.offset = this.renderOptions.feet.offset + 0.25
    } else {
      this.renderOptions.feet.offset = this.renderOptions.feet.offset - 0.25
    }

    if (this.renderOptions.feet.offset >= ~~(feetLength / 2)) {
      this.renderOptions.feet.direction = 'down'
    } else if (this.renderOptions.feet.offset <= 0) {
      this.renderOptions.feet.direction = 'up'
    }
  }

  var renderHair = function(ctx) {
    var self = this
      , px   = this.renderOptions.pixelSize
      , y    = this.options.y + ~~this.renderOptions.feet.offset

    ctx.fillStyle = this.renderOptions.colors.outline

    ;([[0, 0], [-px, -px], [px, -px]]).forEach(function(pair) {
      ctx.fillRect(self.options.x + ~~((self.renderOptions.width - px) / 2) + pair[0], y - px * 2 + pair[1], px, px)
    })
  }

  var renderWeapon = function(ctx) {
    var weapon = 'sword'

    switch (weapon) {
      case 'sword':
        renderSword.call(this, ctx)
        break
    }
  }

  var renderSword = function(ctx) {
    var self  = this
      , px    = this.renderOptions.pixelSize
      , x     = px + ((this.renderOptions.weapon.side === 'left') ? this.options.x - px * 3 : this.options.x + this.renderOptions.width)
      , y     = this.options.y + ~~this.renderOptions.feet.offset + px
      , angle = ((this.renderOptions.weapon.side === 'left') ? -1 : 1) * this.renderOptions.weapon.angle

    ctx.fillStyle = this.renderOptions.colors.outline

    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.fillRect(0, -px * 5, px, px * 5)
    ctx.fillRect(-px, -px * 2 , px * 3, px )
    ctx.rotate(-angle)
    ctx.translate(-x, -y)

    if (this.options.attacking)  {
      if (this.renderOptions.weapon.direction === 'down') {
        this.renderOptions.weapon.angle = this.renderOptions.weapon.angle - 0.1
      } else {
        this.renderOptions.weapon.angle = this.renderOptions.weapon.angle + 0.1
      }

      if (this.renderOptions.weapon.angle >= 1.4) {
        this.renderOptions.weapon.direction = 'down'
      } else if (this.renderOptions.weapon.angle <= 0) {
        this.renderOptions.weapon.direction = 'up'
        this.options.attacking = false
      }
    }
  }

  return Player
})()
