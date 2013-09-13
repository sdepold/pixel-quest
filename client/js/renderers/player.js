window.PixelQuest.Renderers.Player = (function() {
  "use strict"

  var Player = function(id, player) {
    this.id            = id
    this.object        = player
    this.renderOptions = {
      levelUp: {
        levelUp: false,
        step:    0
      },

      death: {
        callback: null
      },

      attack: {
        callback: null
      }
    }
  }

  Player.prototype.isActivePlayer = function() {
    return this.id === window.PixelQuest.Utils.getIdentifier()
  }

  Player.prototype.resetStats = function() {
    this.object.options.renderOptions.colors.outline = "#2c3e50"
    this.object.options.renderOptions.colors.opacity = 1
    this.object.options.renderOptions.feet.delta = 0.25
  }

  Player.prototype.alive = function() {
    return this.object.options.hp > 0
  }

  Player.prototype.animateDeath = function(callback) {
    this.object.options.renderOptions.death.dead = true
    this.object.options.renderOptions.death.step = 0
    this.renderOptions.death.callback = callback
  }

  Player.prototype.animateExperience = function(exp) {
    var px = this.object.options.renderOptions.pixelSize

    this.object.options.renderOptions.experience.push({
      value: exp,
      step:  0,
      x:     this.object.options.x + (Math.random() * this.object.options.renderOptions.width),
      y:     this.object.options.y - 2 * px
    })
  }

  Player.prototype.animateLevelUp = function() {
    this.renderOptions.levelUp.levelUp = true
    this.renderOptions.levelUp.step = 0
  }

  Player.prototype.animateHit = function(dmg) {
    var px = this.object.options.renderOptions.pixelSize

    this.object.options.renderOptions.damages.push({
      value: dmg,
      step:  0,
      x:     this.object.options.x + (Math.random() * this.object.options.renderOptions.width),
      y:     this.object.options.y - 2 * px
    })

  }

  Player.prototype.update = function(player) {
    this.object = player
  }

  Player.prototype.render = function(ctx) {
    if (this.alive()) {
      this.resetStats()
    }

    renderDeath.call(this, ctx)
    renderLevelUp.call(this, ctx)
    renderBody.call(this, ctx)
    renderArms.call(this,ctx)
    renderWeapon.call(this, ctx)
    renderHair.call(this, ctx)
    renderFeet.call(this, ctx)
    renderExperience.call(this, ctx)
    renderDamage.call(this, ctx)
  }

  Player.prototype.move = function(direction, step) {
    if (!this.alive()) {
      return
    }

    step = step || this.object.options.stepSize

    switch (direction) {
      case 'left':
        this.object.options.x = this.object.options.x - step
        this.object.options.renderOptions.weapon.side = 'left'
        break
      case 'right':
        this.object.options.x = this.object.options.x + step
        this.object.options.renderOptions.weapon.side = 'right'
        break
      case 'up':
        this.object.options.y = Math.max(230, this.object.options.y - step)
        break
      case 'down':
        this.object.options.y = this.object.options.y + step
        break
    }
  }

  Player.prototype.attack = function(callback) {
    if (!this.object.options.attacking) {
      this.object.options.attacking      = true
      this.renderOptions.attack.callback = callback
    }
  }

  /////////////
  // private //
  /////////////

  var renderDeath = function(ctx) {
    if (!this.alive()) {
      this.object.options.renderOptions.feet.delta = 0.05
      this.object.options.renderOptions.colors.opacity = this.object.options.renderOptions.colors.opacity - 0.005

      var color = 'rgba(255, 0, 0, ' + this.object.options.renderOptions.colors.opacity + ')'

      if (this.object.options.renderOptions.colors.opacity <= 0) {
        this.renderOptions.death.callback && this.renderOptions.death.callback()
      } else {
        this.object.options.renderOptions.colors.outline = color
      }

      var px = this.object.options.renderOptions.pixelSize
        , x  = this.object.options.x + ~~(this.object.options.renderOptions.width / 2)
        , y  = this.object.options.y + 2*px - this.object.options.renderOptions.death.step

      ctx.font = "bold 12px sans-serif"
      ctx.fillStyle = color
      ctx.textAlign = 'center'

      ctx.fillText('I had', x, y)

      if (this.object.options.renderOptions.death.step > (2 * px)) {
        ctx.fillText('bad', x, y + px * 4)
      }

      if (this.object.options.renderOptions.death.step > (6 * px)) {
        ctx.fillText('luck', x, y + px * 8)
      }

      if (this.object.options.renderOptions.death.step < 14 * px) {
        this.object.options.renderOptions.death.step = this.object.options.renderOptions.death.step + 0.45
      }
    }
  }

  var renderBody = function(ctx) {
    var px = this.object.options.renderOptions.pixelSize
      , y  = this.object.options.y + ~~this.object.options.renderOptions.feet.offset

    ctx.fillStyle = this.object.options.renderOptions.colors.outline

    ctx.fillRect(this.object.options.x, y, this.object.options.renderOptions.width, this.object.options.renderOptions.height)
    ctx.fillRect(this.object.options.x + px, y - px, this.object.options.renderOptions.width - px * 2, px)
    ctx.fillRect(
      this.object.options.x + px,
      y + this.object.options.renderOptions.height,
      this.object.options.renderOptions.width - px * 2,
      px
    )

    // face
    ctx.fillStyle = this.object.options.renderOptions.colors.face
    ctx.fillRect(
      this.object.options.x + px,
      y,
      this.object.options.renderOptions.width - px * 2,
      this.object.options.renderOptions.height - px
    )

    // eyes
    ctx.fillStyle = this.object.options.renderOptions.colors.outline

    if (this.alive()) {
      ctx.fillRect(this.object.options.x + px * 2, y + px, px, px)
      ctx.fillRect(this.object.options.x + this.object.options.renderOptions.width - px * 3, y + px, px, px)
    } else {
      ctx.font = "normal 10px sans-serif"
      ctx.textAlign = 'left'

      ctx.fillText('x', this.object.options.x + px * 1.5, y + 3 * px)
      ctx.fillText('x', this.object.options.x + this.object.options.renderOptions.width - px * 3, y + 3 * px)
    }
  }

  var renderArms = function(ctx) {
    var px = this.object.options.renderOptions.pixelSize
      , y  = this.object.options.y + ~~this.object.options.renderOptions.feet.offset

    ctx.fillStyle = this.object.options.renderOptions.colors.outline

    // left
    ctx.fillRect(this.object.options.x - px * 2, y + px * 2, px * 2, px)
    ctx.fillRect(this.object.options.x - px * 2, y + px, px, px)

    // right
    ctx.fillRect(this.object.options.x + this.object.options.renderOptions.width, y + px * 2, px * 2, px)
    ctx.fillRect(this.object.options.x + this.object.options.renderOptions.width + px, y + px, px, px)
  }

  var renderFeet = function(ctx) {
    var px         = this.object.options.renderOptions.pixelSize
      , y          = this.object.options.y + ~~this.object.options.renderOptions.feet.offset
      , feetLength = ~~((this.object.options.renderOptions.height + px * 2) / 2)

    ctx.fillStyle = this.object.options.renderOptions.colors.outline

    ctx.fillRect(this.object.options.x + px * 2, y + this.object.options.renderOptions.height, px, feetLength - ~~this.object.options.renderOptions.feet.offset)
    ctx.fillRect(this.object.options.x + this.object.options.renderOptions.width - px * 3, y + this.object.options.renderOptions.height, px, feetLength - ~~this.object.options.renderOptions.feet.offset)

    if (this.object.options.renderOptions.feet.direction === 'up') {
      this.object.options.renderOptions.feet.offset = this.object.options.renderOptions.feet.offset + this.object.options.renderOptions.feet.delta
    } else {
      this.object.options.renderOptions.feet.offset = this.object.options.renderOptions.feet.offset - this.object.options.renderOptions.feet.delta
    }

    if (this.object.options.renderOptions.feet.offset >= ~~(feetLength / 2)) {
      this.object.options.renderOptions.feet.direction = 'down'
    } else if (this.object.options.renderOptions.feet.offset <= 0) {
      this.object.options.renderOptions.feet.direction = 'up'
    }
  }

  var renderHair = function(ctx) {
    var self = this
      , px   = this.object.options.renderOptions.pixelSize
      , y    = this.object.options.y + ~~this.object.options.renderOptions.feet.offset

    ctx.fillStyle = this.object.options.renderOptions.colors.outline

    ;([[0, 0], [-px, -px], [px, -px]]).forEach(function(pair) {
      ctx.fillRect(self.object.options.x + ~~((self.object.options.renderOptions.width - px) / 2) + pair[0], y - px * 2 + pair[1], px, px)
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
      , px    = this.object.options.renderOptions.pixelSize
      , x     = px + ((this.object.options.renderOptions.weapon.side === 'left') ? this.object.options.x - px * 3 : this.object.options.x + this.object.options.renderOptions.width)
      , y     = this.object.options.y + ~~this.object.options.renderOptions.feet.offset + px
      , angle = ((this.object.options.renderOptions.weapon.side === 'left') ? -1 : 1) * this.object.options.renderOptions.weapon.angle

    ctx.fillStyle = this.object.options.renderOptions.colors.outline

    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.fillRect(0, -px * 5, px, px * 5)
    ctx.fillRect(-px, -px * 2 , px * 3, px )
    ctx.rotate(-angle)
    ctx.translate(-x, -y)

    if (this.alive() && this.object.options.attacking)  {
      if (this.object.options.renderOptions.weapon.direction === 'down') {
        this.object.options.renderOptions.weapon.angle = this.object.options.renderOptions.weapon.angle - 0.1
      } else {
        this.object.options.renderOptions.weapon.angle = this.object.options.renderOptions.weapon.angle + 0.1
      }

      if (this.object.options.renderOptions.weapon.angle >= 1.4) {
        this.object.options.renderOptions.weapon.direction = 'down'

        if (this.isActivePlayer() && this.renderOptions.attack.callback) {
          this.renderOptions.attack.callback()
          this.renderOptions.attack.callback = null
        }
      } else if (this.object.options.renderOptions.weapon.angle <= 0) {
        this.object.options.renderOptions.weapon.direction = 'up'
        this.object.options.attacking = false
      }
    }
  }


  var renderExperience = function(ctx) {
    var self = this

    ctx.font = "bold 12px sans-serif"

    this.object.options.renderOptions.experience = this.object.options.renderOptions.experience.sort(function(a, b) {
      return a.value - b.value
    }).filter(function(experience, i) {
      if (i === 0) {
        experience.step = experience.step + 0.2

        var opacity = 1 - experience.step / 10

        ctx.fillStyle = 'rgba(39, 139, 210, ' + opacity + ')'
        ctx.fillText("+" + experience.value, experience.x, experience.y - experience.step)

        if (experience.step < 10) {
          return true
        } else {
          if (self.object.options.renderOptions.experience.length > 1) {
            self.object.options.renderOptions.experience[1].x = self.object.options.x + (Math.random() * self.object.options.renderOptions.width)
            self.object.options.renderOptions.experience[1].y = self.object.options.y
          }

          return false
        }
      } else {
        // only animate one experience thingy at once
        return true
      }
    })
  }

  var renderLevelUp = function(ctx) {
    if (this.renderOptions.levelUp.levelUp) {
      this.renderOptions.levelUp.step = this.renderOptions.levelUp.step + 0.05

      var px = this.object.options.renderOptions.pixelSize
        , x  = this.object.options.x + ~~(this.object.options.renderOptions.width / 2)
        , y  = this.object.options.y - 0 * px

      y = y - this.renderOptions.levelUp.step * px

      ctx.fillStyle = this.object.options.renderOptions.colors.outline
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = 'center'
      ctx.fillText("Lvl up!", x, y)

      if (this.renderOptions.levelUp.step > 10) {
        this.renderOptions.levelUp.levelUp = false
        this.renderOptions.levelUp.step = 0
      }
    }
  }

  var renderDamage = function(ctx) {
    var self = this

    ctx.font = "bold 12px sans-serif"

    this.object.options.renderOptions.damages = this.object.options.renderOptions.damages.filter(function(dmg, i) {
      dmg.step = dmg.step + 0.2

      var opacity = 1 - dmg.step / 10

      ctx.fillStyle = 'rgba(192, 57, 43, ' + opacity + ')'
      ctx.fillText("-" + dmg.value, dmg.x, dmg.y - dmg.step)

      return dmg.step < 10
    })
  }

  return Player
})()
