window.PixelQuest = (function() {
  var PixelQuest = function() {
    // initialize the game
    this.game = new PixelQuest.Game()
  }

  PixelQuest.prototype.start = function() {
    var self = this

    this.renderIntervalId = setInterval(function() {
      self.game.render(self.player)

      if (self.player && self.socket) {
        self.socket.emit('player#update', self.player.object)
      }
    }, 10)

    // connect to the server and load the user's data
    this.connectToServer(function(player) {
      self.player = new PixelQuest.Renderers.Player(player.id, player)
      self.game.addObject(self.player)

      var interaction = new PixelQuest.Interaction(self.player, self.socket)
      interaction.bindKeyboardToPlayer()
    })
  }

  PixelQuest.prototype.getPlayerId = function() {
    var id = window.PixelQuest.Utils.getIdentifier()

    if (!id) {
      id = window.PixelQuest.Utils.generateIdentifier()
      window.PixelQuest.Utils.setIdentifier(id)
    }

    return id
  }

  PixelQuest.prototype.connectToServer = function(callback) {
    var self    = this

    this.socket = io.connect("http://" + document.location.host)

    this.socket.on('world#sync', this.onWorldSync.bind(this))

    this.socket.on('monster#killed', function(monster) {
      self.game.removeObject(monster)
    })

    this.socket.on('player#experience', function(player, exp) {
      self.game.getObject(player.id).animateExperience(exp)
    })

    this.socket.on('player#levelUp', function(player) {
      self.game.getObject(player.id).animateLevelUp()
    })

    this.socket.on('player#update', function(_player) {
      var player = self.game.getObject(_player.id)

      ;(['experience', 'achievements', 'x', 'y', 'hp', 'originalHp']).forEach(function(field) {
        player.object.options[field] = _player.options[field]
      })
    })

    this.socket.on('player#hit', function(playerId, damage) {
      var player = self.game.getObject(playerId)
      player.animateHit(damage)
    })

    this.socket.on('player#joined', callback)
    this.socket.emit('player#join', { id: this.getPlayerId() })
  }

  PixelQuest.prototype.onWorldSync = function(type, data) {
    var klass  = PixelQuest.Renderers[type]
      , self   = this

    data.forEach(function(objectData) {
      var object = self.game.getObject(objectData.id)

      if (!!object) {
        object.update(objectData)
      } else {
        object = new klass(objectData.id, objectData)
        self.game.addObject(object)
      }
    })

  }

  return PixelQuest
})()
