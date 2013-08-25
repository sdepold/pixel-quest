window.PixelQuest = {
  initialize: function() {
    var id = this.getIdentifier()

    if (!id) {
      id = this.generateIdentifier()
      this.setIdentifier(id)
    }

    // initialize the game
    this.game = new PixelQuest.Game()

    // exec the render loop
    setInterval(function() {
      this.game.render()

      if (this.player && this.socket) {
        var data = this.player.toJSON()
        data.id = id
        this.socket.emit('player#update', data)
      }

    }.bind(this), 10)

    // connect to the server and load the user's data
    window.PixelQuest.connectToServer(id, function(playerData) {
      this.player = new PixelQuest.Player(playerData.x, playerData.y, playerData)
      this.game.renderables.push(this.player)

      var interaction = new PixelQuest.Interaction(this.player)
      interaction.bindKeyboardToPlayer()
    }.bind(this))
  },

  connectToServer: function(id, callback) {
    this.socket = io.connect('http://localhost')
    this.socket.on('player#joined', callback)
    this.socket.emit('player#join', { id: id })
  },

  getIdentifier: function() {
    var cookies = {}

    ;(document.cookie || "").split(';').forEach(function(pair) {
      var split = pair.split("=")
      cookies[split[0].trim()] = split[1].trim()
    })

    return cookies.PixelQuestIdentifier
  },

  setIdentifier: function(id) {
    document.cookie = 'PixelQuestIdentifier=' + id + '; expires=Tue, 1 Jan 2030 00:00:00 UTC; path=/'
  },

  generateIdentifier: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    })
  }
}
