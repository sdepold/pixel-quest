window.PixelQuest = {
  initialize: function() {
    // initialize the game
    this.game = new PixelQuest.Game()

    // exec the render loop
    setInterval(function() {
      this.game.render()
    }.bind(this), 10)

    // connect to the server and load the user's data
    window.PixelQuest.connectToServer(function(playerData) {
      this.player = new PixelQuest.Player(playerData.x, playerData.y, playerData)
      this.game.renderables.push(this.player)

      var interaction = new PixelQuest.Interaction(this.player)
      interaction.bindKeyboardToPlayer()

    }.bind(this))
  },

  connectToServer: function(callback) {
    var socket = io.connect('http://localhost')
    socket.on('player#joined', callback)
    socket.emit('player#join', { id: 'foo' })
  }
}
