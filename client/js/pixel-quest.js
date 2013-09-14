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
        var data = window.PixelQuest.Utils.lzw_encode(JSON.stringify(self.player.object))
        self.socket.emit('player#update', data)
      }
    }, 10)

    // connect to the server and load the user's data
    this.connectToServer(function(player) {
      player = JSON.parse(window.PixelQuest.Utils.lzw_decode(player))
      self.player = new PixelQuest.Renderers.Player(player.id, player)
      self.game.addObject(self.player)

      var interaction = new PixelQuest.Interaction(self.player, self.socket)
      interaction.bindKeyboardToPlayer()
    })
  }

  PixelQuest.prototype.connectToServer = function(callback) {
    var self   = this
    var events = {
      "uuid": function(uuid) {
        _uuid = window.PixelQuest.Utils.lzw_decode(uuid)
        PixelQuest.Utils.setIdentifier(_uuid)
        self.socket.emit('player#join', uuid)
      },

      'player#joined': callback,

      'world#sync': self.onWorldSync.bind(self),

      'player#quit': function (playerId) {
        playerId = window.PixelQuest.Utils.lzw_decode(playerId)
        self.game.removeObject(playerId)
      },

      'player#update': function(_player) {
        _player = JSON.parse(window.PixelQuest.Utils.lzw_decode(_player))

        var player = self.game.getObject(_player.id)
          , fields = ['experience', 'achievements', 'x', 'y', 'hp', 'originalHp']

        fields.forEach(function(field) {
          player.object.options[field] = _player.options[field]
        })
      },

      'monster#killed': function(monster) {
        monster = JSON.parse(window.PixelQuest.Utils.lzw_decode(monster))
        self.game.removeObject(monster)
      },

      'player#experience': function(player, exp) {
        player = JSON.parse(window.PixelQuest.Utils.lzw_decode(player))
        exp    = window.PixelQuest.Utils.lzw_decode(exp)

        self.game.getObject(player.id).animateExperience(exp)
      },

      'player#levelUp': function(player) {
        player = JSON.parse(window.PixelQuest.Utils.lzw_decode(player))
        self.game.getObject(player.id).animateLevelUp()
      },

      'player#update': function(_player) {
        _player = JSON.parse(window.PixelQuest.Utils.lzw_decode(_player))

        var player = self.game.getObject(_player.id)
          , fields = ['experience', 'achievements', 'x', 'y', 'hp', 'originalHp']

        fields.forEach(function(field) {
          player.object.options[field] = _player.options[field]
        })
      },

      'player#hit': function(playerId, damage) {
        playerId = window.PixelQuest.Utils.lzw_decode(playerId)
        damage   = window.PixelQuest.Utils.lzw_decode(damage)

        var player = self.game.getObject(playerId)
        player.animateHit(damage)
      },

      'player#died': function(playerId) {
        playerId = window.PixelQuest.Utils.lzw_decode(playerId)

        var player = self.game.getObject(playerId)

        player.animateDeath(function() {
          self.socket.emit('player#resurrect', playerId)
        })
      },

      'player#reset': function(playerId) {
        playerId = window.PixelQuest.Utils.lzw_decode(playerId)
        self.game.getObject(playerId).resetStats()
      }
    }

    self.socket = io.connect("http://" + document.location.host)

    Object.keys(events).forEach(function(eventName) {
      self.socket.on(eventName, events[eventName])
    })
  }

  PixelQuest.prototype.onWorldSync = function(type, data) {
    type = window.PixelQuest.Utils.lzw_decode(type)
    data = JSON.parse(window.PixelQuest.Utils.lzw_decode(data))

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
