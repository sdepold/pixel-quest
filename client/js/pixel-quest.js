window.PixelQuest = {
  initialize: function() {
    var self = this

    this.player = new PixelQuest.Player()
    this.game   = new PixelQuest.Game()

    this.game.renderables.push(this.player)

    var interaction = new PixelQuest.Interaction(this.player)
    interaction.bindKeyboardToPlayer()

    setInterval(function() {
      self.game.render()
    }, 10)
  }
}
