window.PixelQuest.Monster = (function() {
  "use strict"

  var Monster = function(id, options) {
    this.id      = id
    this.options = PixelQuest.Utils.extend({
      renderOptions: {
        pixelSize: 6,
        face: {
          toothX: null
        }
      }
    }, options || {})

    this.options.renderOptions.face.toothX = ~~(Math.random() * (this.options.width - 5 * this.options.renderOptions.pixelSize))
  }

  Monster.prototype.render = function(ctx) {
    renderBody.call(this, ctx)
    renderArms.call(this, ctx)
    renderFeet.call(this, ctx)
  }

  Monster.prototype.toJSON = function() {
    var data = this.options
    data.id = this.id
    return data
  }

  Monster.prototype.update = function(data) {
    this.options = PixelQuest.Utils.extend(this.options, data)
  }

  // private

  var renderBody = function(ctx) {
    var px = this.options.renderOptions.pixelSize

    ctx.fillStyle = this.options.color
    ctx.fillRect(
      this.options.x,
      this.options.y,
      this.options.width,
      this.options.height
    )
    ctx.fillStyle = '#FFFFFF'
    // eye left
    ctx.fillRect(this.options.x + px, this.options.y + px, px, px)

    // eye right
    ctx.fillRect(this.options.x + this.options.width - 2 * px, this.options.y + px, px, px)

    // mouth
    ctx.fillRect(this.options.x + 2 * px, this.options.y + 3 * px, this.options.width - 4 * px, 0.5 * px)

    // tooth
    ctx.fillRect(
      this.options.x + 2 * px + this.options.renderOptions.face.toothX,
      this.options.y + 3.5 * px - 1,
      px / 2,
      0.5 * px
    )
  }

  var renderArms = function(ctx) {
    var px = this.options.renderOptions.pixelSize

    ctx.fillStyle = this.options.color
    ctx.fillRect(this.options.x - px, this.options.y + px, px + 1, px * 2)
    ctx.fillRect(this.options.x - 2 * px, this.options.y + 2 * px, px + 1, this.options.width - 2 * px)
    ctx.fillRect(this.options.x + this.options.width - 1, this.options.y + px, px + 1, px * 2)
    ctx.fillRect(this.options.x + this.options.width - 1 + px, this.options.y + 2 * px, px + 1, this.options.width - 2 * px)
  }

  var renderFeet = function(ctx) {
    var px = this.options.renderOptions.pixelSize

    ctx.fillStyle = this.options.color
    ctx.fillRect(this.options.x + px, this.options.y + this.options.height - 1, px, px * 2)
    ctx.fillRect(this.options.x + 1, this.options.y + this.options.height + px - 1, px, px)
    ctx.fillRect(this.options.x + this.options.width - 2 * px, this.options.y + this.options.height - 1, px, px * 2)
    ctx.fillRect(this.options.x + this.options.width - 1 - px, this.options.y + this.options.height + px - 1, px, px)

  }

  return Monster
})()
