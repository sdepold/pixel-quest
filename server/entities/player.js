var utils   = require('../utils.js')
  , Monster = require('./monster')

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
      level: 1,
      current: 0,
      total: 0,
      neededForLevelUp: 400
    },
    achievements: {
      current: generateAchievement(),
      done: []
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
  return {
    experience: increaseExperience.call(this, monster.options.difficulty * 20),
    levelUp: checkForLevelUp.call(this),
    achievement: checkForAchiements.call(this, monster)
  }
}

/////////////
// private //
/////////////

var increaseExperience = function(experience) {
  this.options.experience.current = this.options.experience.current + experience
  this.options.experience.total   = this.options.experience.total + experience

  return experience
}

var checkForLevelUp = function() {
  if (this.options.experience.current >= this.options.experience.neededForLevelUp) {
    this.options.experience.current = this.options.experience.current - this.options.experience.neededForLevelUp
    this.options.experience.neededForLevelUp = this.options.experience.neededForLevelUp * 2

    // increase strength
    this.options.strength = this.options.strength + 2

    // increase speed
    this.options.stepSize = Math.min(this.options.stepSize + 1, 10)

    // increate the level
    this.options.experience.level++

    return this.options.renderOptions.levelUp.levelUp = true
  } else {
    return false
  }
}

var checkForAchiements = function(monster) {
  if (monster.options.color === '#' + this.options.achievements.current.color) {
    this.options.achievements.current.achieved++
  }

  if (this.options.achievements.current.achieved === this.options.achievements.current.needed) {
    var result = {
      done: true,
      experience: this.options.achievements.current.experience
    }

    increaseExperience.call(this, result.experience)

    this.options.achievements.done.push(this.options.achievements.current)
    this.options.achievements.current = generateAchievement()

    return result
  } else {
    return {
      done: false
    }
  }
}

var generateAchievement = function() {
  var needed = 1 + ~~(Math.random() * 10)
    , color  = Monster.getRandomColor()

  return {
    color:      color,
    colorName:  Monster.COLORS[color],
    achieved:   0,
    needed:     needed,
    experience: needed * ~~(Math.random() * 50)
  }
}
