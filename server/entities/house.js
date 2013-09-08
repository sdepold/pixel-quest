var utils = require('../utils.js')

var House = module.exports = function() {
  this.id        = utils.generateIdentifier()
  this.className = 'House'

  this.options = {
    type: House.TYPES[~~(Math.random() * (House.TYPES.length - 1))],
    x:    Math.random() * 1000,
    y:    Math.random() * 1000
  }
}

House.TYPES = [{
  name:   'small',
  width:  12,
  height: 15
}, {
  name:   'large',
  width:  18,
  height: 15
}]
