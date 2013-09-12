var utils = require('../utils.js')

var Monster = module.exports = function() {
  var weight = 30 + (Math.random() * 30)
  weight     = weight - (weight % 6)

  var hp = (Math.pow(weight,2) / Math.pow(60,2)) * 100

  this.id        = utils.generateIdentifier()
  this.className = 'Monster'

  this.options = {
    id:         this.id,
    x:          Math.random() * 1000,
    y:          220 + Math.random() * 600,
    difficulty: weight,
    damage:     ~~(weight / 30),
    height:     weight,
    width:      weight,
    color:      '#' + Monster.getRandomColor(),
    target:     null,
    walkSpeed:  (Math.pow(60,2) / Math.pow(weight,2)) * 10,
    hp:         hp,
    originalHp: hp,
    attackedOptions: {
      attacked:  false,
      diff:      0,
      direction: 'left'
    },
    renderOptions: {
      pixelSize: 6,
      feet: {
        offset: 0,
        direction: "up"
      },
      face: {
        toothX: null
      },
      damages: []
    }
  }

  var toothX = ~~(Math.random() * (this.options.width - 5 * this.options.renderOptions.pixelSize))
  this.options.renderOptions.face.toothX = toothX
}

Monster.COLORS = {
  '1abc9c': 'turquoise',
  'f39c12': 'orange',
  '2ecc71': 'green',
  'd35400': 'red',
  '3498db': 'blue',
  '9b59b6': 'purple',
  'bdc3c7': 'silver',
  '2c3e50': 'grey'
}

Monster.getRandomColor = function() {
  var codes = Object.keys(Monster.COLORS)
  return codes[~~(Math.random() * (codes.length - 1))]
}

Monster.prototype.iterate = function() {
  if (this.options.attackedOptions.attacked) {
    if (this.options.attackedOptions.diff < 31) {
      var distance = 5

      this.options.x = this.options.x + ((this.options.attackedOptions.direction === 'left' ? -1 : 1) * distance)
      this.options.attackedOptions.diff = this.options.attackedOptions.diff + distance
    } else {
      this.options.attackedOptions.attacked = false
      this.options.attackedOptions.diff = 0
      this.options.target = null
    }
  } else {
    this.animateFeet()
    this.walk()
  }

  this.options.renderOptions.damages = this.options.renderOptions.damages.filter(function(damage) {
    damage.step = damage.step + 0.2
    return damage.step < 10
  })

  return this
}

Monster.prototype.hit = function(strength, direction) {
  this.options.hp = Math.max.call(this, 0, this.options.hp - strength)
  this.options.attackedOptions.attacked = true
  this.options.attackedOptions.direction = direction

  this.options.renderOptions.damages.push({
    x: this.options.x + 20 + (Math.random() * this.options.width),
    y: this.options.y,
    damage: strength,
    step: 0
  })
}

Monster.prototype.alive = function() {
  return this.options.hp > 0
}

Monster.prototype.getTarget = function() {
  if (this.options.target) {
    return this.options.target
  } else {
    this.options.target = {
      x:      Math.random() * 1000,
      y:      220 + Math.random() * 600,
      startX: this.options.x,
      startY: this.options.y
    }

    this.options.target.distance = Math.sqrt(
      Math.pow(this.options.target.x - this.options.x, 2) +
      Math.pow(this.options.target.y - this.options.y, 2)
    )

    this.options.target.directionX = (this.options.target.x - this.options.x) / this.options.target.distance
    this.options.target.directionY = (this.options.target.y - this.options.y) / this.options.target.distance

    return this.options.target
  }
}

Monster.prototype.walk = function() {
  var target  = this.getTarget()
    , elapsed = 0.01

  this.options.x += this.options.target.directionX * this.options.walkSpeed * elapsed
  this.options.y += this.options.target.directionY * this.options.walkSpeed * elapsed

  if (Math.sqrt(Math.pow(this.options.x - this.options.target.startX, 2) + Math.pow(this.options.y - this.options.target.startY, 2)) >= this.options.target.distance) {
    this.options.x      = this.options.target.x
    this.options.y      = this.options.target.y
    this.options.target = null
  }
}

Monster.prototype.animateFeet = function() {
  var px = this.options.renderOptions.pixelSize

  if (this.options.renderOptions.feet.direction === 'up') {
    this.options.renderOptions.feet.offset = this.options.renderOptions.feet.offset + 0.15
  } else {
    this.options.renderOptions.feet.offset = this.options.renderOptions.feet.offset - 0.15
  }

  if (this.options.renderOptions.feet.offset >= 2 * px) {
    this.options.renderOptions.feet.direction = 'down'
  } else if (this.options.renderOptions.feet.offset <= 0) {
    this.options.renderOptions.feet.direction = 'up'
  }

  return this
}

Monster.prototype.inAttackRange = function(player) {
  var playerTop     = player.options.y
    , playerBottom  = playerTop + player.options.renderOptions.height
    , playerLeft    = player.options.x
    , playerRight   = playerLeft + player.options.renderOptions.width
    , monsterTop    = this.options.y
    , monsterBottom = monsterTop + this.options.height
    , monsterLeft   = this.options.x
    , monsterRight  = monsterLeft + this.options.width

  return (
    (playerRight > monsterLeft) &&
    (playerLeft < monsterRight) &&
    (playerBottom > monsterTop) &&
    (playerTop < monsterBottom)
  )
}
