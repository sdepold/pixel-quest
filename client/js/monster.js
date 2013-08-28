window.PixelQuest.Monster = (function() {
  "use strict"

  var Monster = function(id, options) {
    this.id      = id
    this.options = options || {}
  }

  Monster.prototype.render = function(ctx) {
    console.log('noot')

    ctx.fillStyle = this.options.color

    ctx.fillRect(
      this.options.x,
      this.options.y,
      this.options.width,
      this.options.height
    )
  }

  Monster.prototype.toJSON = function() {
    var data = this.options
    data.id = this.id
    return data
  }

  Monster.prototype.update = function(data) {
    this.options = data
  }

  return Monster
})()
