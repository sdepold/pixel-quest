window.PixelQuest.Renderers.Monster = (function() {
  "use strict"

  var Monster = function(id, monster) {
    this.id      = id
    this.monster = monster
  }

  Monster.prototype.render = function(ctx) {
    renderBody.call(this, ctx)
    renderArms.call(this, ctx)
    renderFeet.call(this, ctx)

    if (this.monster.options.hp !== this.monster.options.originalHp) {
      renderHealth.call(this, ctx)
    }

    renderDamage.call(this, ctx)
  }

  Monster.prototype.toJSON = function() {
    var data = this.monster.options
    data.id = this.id
    return data
  }

  Monster.prototype.update = function(monster) {
    this.monster = monster
  }

  // private

  var renderBody = function(ctx) {
    var px = this.monster.options.renderOptions.pixelSize
      , y  = this.monster.options.y + this.monster.options.renderOptions.feet.offset

    ctx.fillStyle = this.monster.options.color
    ctx.fillRect(this.monster.options.x, y, this.monster.options.width, this.monster.options.height)

    ctx.fillStyle = '#FFFFFF'

    // eye left
    ctx.fillRect(this.monster.options.x + px, y + px, px, px)

    // eye right
    ctx.fillRect(this.monster.options.x + this.monster.options.width - 2 * px, y + px, px, px)

    // mouth
    ctx.fillRect(this.monster.options.x + 2 * px, y + 3 * px, this.monster.options.width - 4 * px, 0.5 * px)

    // tooth
    ctx.fillRect(
      this.monster.options.x + 2 * px + this.monster.options.renderOptions.face.toothX,
      y + 3.5 * px - 1,
      px / 2,
      0.5 * px
    )
  }

  var renderArms = function(ctx) {
    var px = this.monster.options.renderOptions.pixelSize
      , y  = this.monster.options.y + this.monster.options.renderOptions.feet.offset

    ctx.fillStyle = this.monster.options.color
    ctx.fillRect(this.monster.options.x - px, y + px, px + 1, px * 2)
    ctx.fillRect(this.monster.options.x - 2 * px, y + 2 * px, px + 1, this.monster.options.width - 2 * px)
    ctx.fillRect(this.monster.options.x + this.monster.options.width - 1, y + px, px + 1, px * 2)
    ctx.fillRect(this.monster.options.x + this.monster.options.width - 1 + px, y + 2 * px, px + 1, this.monster.options.width - 2 * px)
  }

  var renderFeet = function(ctx) {
    var px = this.monster.options.renderOptions.pixelSize
      , y  = this.monster.options.y + this.monster.options.renderOptions.feet.offset

    ctx.fillStyle = this.monster.options.color
    ctx.fillRect(this.monster.options.x + px, y + this.monster.options.height - 1, px, px * 3 - this.monster.options.renderOptions.feet.offset)
    ctx.fillRect(this.monster.options.x + this.monster.options.width - 2 * px, y + this.monster.options.height - 1, px, px * 3 - this.monster.options.renderOptions.feet.offset)
    ctx.fillRect(this.monster.options.x + 1, y + this.monster.options.height + 2 * px - 1 - this.monster.options.renderOptions.feet.offset, px, px)
    ctx.fillRect(this.monster.options.x + this.monster.options.width - 1 - px, y + this.monster.options.height + 2 * px - 1 - this.monster.options.renderOptions.feet.offset, px, px)
  }

  var renderHealth = function(ctx) {
    var px    = this.monster.options.renderOptions.pixelSize
      , y     = this.monster.options.y + this.monster.options.renderOptions.feet.offset
      , count = ~~((this.monster.options.width - px) / (px + 2))

    ctx.fillStyle = '#FFFFFF'

    ctx.fillRect(
      this.monster.options.x + px,
      y + this.monster.options.height - 4,
      (this.monster.options.width - 2 * px) * (this.monster.options.hp / this.monster.options.originalHp),
      2
    )
  }

  var renderDamage = function(ctx) {
    var self = this

    ctx.font = "bold 12px sans-serif"

    this.monster.options.renderOptions.damages.forEach(function(damage) {
      var opacity = 1 - damage.step / 10

      ctx.fillStyle = 'rgba(200, 0, 0, ' + opacity + ')'
      ctx.fillText(damage.damage, damage.x, damage.y - damage.step)
    })
  }

  return Monster
})()
