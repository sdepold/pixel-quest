var utils = require('../utils.js')

var Monster = module.exports = function() {
  var width = 30 + (Math.random() * 30)
  width     = width - (width % 6)

  this.id      = utils.generateIdentifier()
  this.options = {
    id:        this.id,
    x:         Math.random() * 1000,
    y:         Math.random() * 1000,
    height:    width,
    width:     width,
    color:     '#' + (Math.random().toString(16) + '000000').slice(2, 8),
    target:    null,
    walkSpeed: 20,
    renderOptions: {
      pixelSize: 6,
      feet: {
        offset: 0,
        direction: "up"
      },
      face: {
        toothX: null
      }
    }
  }

  var toothX = ~~(Math.random() * (this.options.width - 5 * this.options.renderOptions.pixelSize))
  this.options.renderOptions.face.toothX = toothX
}

Monster.prototype.iterate = function() {
  this.animateFeet()
  this.walk()

  return this
}

Monster.prototype.getTarget = function() {
  if (this.options.target) {
    return this.options.target
  } else {
    this.options.target = {
      x:      Math.random() * 1000,
      y:      Math.random() * 1000,
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
