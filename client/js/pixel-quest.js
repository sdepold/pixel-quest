window.PixelQuest = (function() {
  var PixelQuest = function() {
    // initialize the game
    this.game = new PixelQuest.Game()
  }

  PixelQuest.prototype.start = function() {
    var self = this

    this.renderIntervalId = setInterval(function() {
      self.game.render()

      if (self.player && self.socket) {
        self.socket.emit('player#update', self.player.toJSON())
      }
    }, 10)

    // connect to the server and load the user's data
    this.connectToServer(function(playerData) {
      var id = playerData.id
      delete playerData.id

      self.player = new PixelQuest.Player(id, playerData)
      self.game.addObject(self.player)

      var interaction = new PixelQuest.Interaction(self.player)
      interaction.bindKeyboardToPlayer()
    })
  }

  PixelQuest.prototype.getPlayerId = function() {
    var id = window.PixelQuest.Player.getIdentifier()

    if (!id) {
      id = window.PixelQuest.Player.generateIdentifier()
      window.PixelQuest.Player.setIdentifier(id)
    }

    return id
  }

  PixelQuest.prototype.connectToServer = function(callback) {
    var self    = this
      , options = {}

    if (document.location.href.indexOf('heroku') !== -1) {
      options = {
        "transports": ["xhr-polling"],
        "polling duration": 10
      }
    }

    this.socket = io.connect("http://" + document.location.host, options)

    this.socket.on('world#sync', this.onWorldSync.bind(this))

    this.socket.on('player#joined', callback)
    this.socket.emit('player#join', { id: this.getPlayerId() })
  }

  PixelQuest.prototype.onWorldSync = function(type, data) {
    var klass  = PixelQuest[type] || PixelQuest.Renderers[type]
      , self   = this

    data.forEach(function(objectData) {
      var object = self.game.objects[objectData.id]

      if (objectData.online || !(object instanceof window.PixelQuest.Player)) {
        if (!!object) {
          object.update(objectData)
        } else {
          object = new klass(objectData.id, objectData)
          self.game.addObject(object)
        }
      } else if (!!object && !objectData.online) {
        self.game.removeObject(object)
      }
    })

  }

  return PixelQuest
})()
