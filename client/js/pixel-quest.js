window.PixelQuest = (function() {
  var PixelQuest = function() {
    // initialize the game
    this.game = new PixelQuest.Game()
  }

  PixelQuest.prototype.start = function() {
    this.renderIntervalId = setInterval(function() {
      this.game.render()

      if (this.player && this.socket) {
        this.socket.emit('player#update', this.player.toJSON())
      }
    }.bind(this), 10)

    // connect to the server and load the user's data
    this.connectToServer(function(playerData) {
      var id = playerData.id
      delete playerData.id

      this.player = new PixelQuest.Player(id, playerData)
      this.game.addObject(this.player)

      var interaction = new PixelQuest.Interaction(this.player)
      interaction.bindKeyboardToPlayer()

      this.observeBrowserState()
    }.bind(this))
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
    var klass  = PixelQuest[type]
      , self   = this

    data.forEach(function(playerData) {
      var object = self.game.objects[playerData.id]

      if (playerData.online) {
        if (!!object) {
          object.update(playerData)
        } else {
          object = new klass(playerData.id, playerData)
          self.game.addObject(object)
        }
      } else if (!!object && !playerData.online) {
        self.game.removeObject(object)
      }
    })

  }

  PixelQuest.prototype.observeBrowserState = function() {
    var self = this

    window.onbeforeunload = function() {
      self.socket.emit('player#quit', { id: self.getPlayerId() })
    }
  }

  return PixelQuest
})()
