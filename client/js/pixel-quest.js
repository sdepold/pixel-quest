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
    }.bind(this), 100)

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
    var id = getIdentifier()

    if (!id) {
      id = generateIdentifier()
      setIdentifier(id)
    }

    return id
  }

  PixelQuest.prototype.connectToServer = function(callback) {
    var self = this

    this.socket = io.connect("http://" + document.location.host)

    this.socket.on('world#sync', this.onWorldSync.bind(this))

    this.socket.on('player#joined', callback)
    this.socket.emit('player#join', { id: this.getPlayerId() })
  }

  PixelQuest.prototype.onWorldSync = function(type, data) {
    var object = this.game.objects[data.id]

    if (data.online) {
      if (!!object) {
        object.update(data)
      } else {
        object = new PixelQuest[type](data.id, data)
        this.game.addObject(object)
      }
    } else if (!!object && !data.online) {
      this.game.removeObject(object)
    }
  }

  PixelQuest.prototype.observeBrowserState = function() {
    var self = this

    window.onbeforeunload = function() {
      self.socket.emit('player#quit', { id: self.getPlayerId() })
    }
  }

  /////////////
  // private //
  /////////////

  var getIdentifier = function() {
    var cookies = {}

    ;(document.cookie || "").split(';').forEach(function(pair) {
      var split = pair.split("=")
      if (split[0]) {
        cookies[split[0].trim()] = split[1].trim()
      }
    })

    return cookies.PixelQuestIdentifier
  }

  var setIdentifier = function(id) {
    document.cookie = 'PixelQuestIdentifier=' + id + '; expires=Tue, 1 Jan 2030 00:00:00 UTC; path=/'
  }

  var generateIdentifier = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    })
  }

  return PixelQuest
})()
