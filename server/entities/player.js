var utils = require('../utils.js')

var Player = module.exports = function(id) {
  this.id        = id
  this.className = 'Player'

  this.options = {
    x:             50,
    y:             70,
    movementDelay: 50,
    stepSize:      5,
    online:        true,
    offlineSince:  null,
    strength:      2,
    attacking:     false,
    experience: {
      current: 0,
      total: 0,
      neededForLevelUp: 400
    },
    renderOptions: {
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
      },
      experience: [],
      levelUp: {
        levelUp: false,
        step:    0
      }
    }
  }
}

Player.prototype.update = function(data) {
  var self = this

  Object.keys(data).forEach(function(key) {
    self.options[key] = data[key]
  })

  return this
}

Player.prototype.killedMonster = function(monster) {
  var experience = monster.options.difficulty * 20

  this.options.experience.current = this.options.experience.current + experience
  this.options.experience.total   = this.options.experience.total + experience

  return {
    experience: experience,
    levelUp:    checkForLevelUp.call(this)
  }
}

/////////////
// private //
/////////////

var checkForLevelUp = function() {
  if (this.options.experience.current >= this.options.experience.neededForLevelUp) {
    this.options.experience.current = this.options.experience.current - this.options.experience.neededForLevelUp
    this.options.experience.neededForLevelUp = this.options.experience.neededForLevelUp * 2

    // increase strength
    this.options.strength = this.options.strength + 2

    // increase speed
    this.options.stepSize = Math.min(this.options.stepSize + 1, 10)

    return this.options.renderOptions.levelUp.levelUp = true
  } else {
    return false
  }
}
