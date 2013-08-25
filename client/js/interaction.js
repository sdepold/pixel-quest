window.PixelQuest.Interaction = (function() {
  var Interaction = function(player) {
    this.player        = player
    this.movementDelta = 5
    this.activeKeys    = []
  }

  Interaction.prototype.bindKeyboardToPlayer = function() {
    var self = this

    document.onkeydown = function(e) {
      e = e || window.event

      var keyCode = e.which || e.keyCode

      if (self.activeKeys.indexOf(keyCode) === -1) {
        self.activeKeys.push(keyCode)
      }
    }

    document.onkeyup = function(e) {
      e = e || window.event

      var keyCode = e.which || e.keyCode
        , index   = self.activeKeys.indexOf(keyCode)

      if (index !== -1) {
        self.activeKeys.splice(index, 1)
      }
    }

    window.setInterval(function() {
      setPlayerPosition.call(self)
    }, this.player.options.movementDelay)
  }

  // private

  var setPlayerPosition = function(keyCode) {
    var self = this

    this.activeKeys.forEach(function(key) {
      switch (key) {
        case 37:
          self.player.x = self.player.x - self.movementDelta
          break
        case 38:
          self.player.y = self.player.y - self.movementDelta
          break
        case 39:
          self.player.x = self.player.x + self.movementDelta
          break
        case 40:
          self.player.y = self.player.y + self.movementDelta
          break
      }
    })
  }

  return Interaction
})()
