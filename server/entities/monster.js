var utils = require('../utils.js')

var Monster = module.exports = function() {
  var width = 30 + (Math.random() * 30)
  width     = width - (width % 6)

  this.id      = utils.generateIdentifier()
  this.options = {
    id:     this.id,
    x:      Math.random() * 1000,
    y:      Math.random() * 1000,
    height: width,
    width:  width,
    color:  '#' + (Math.random().toString(16) + '000000').slice(2, 8),
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
