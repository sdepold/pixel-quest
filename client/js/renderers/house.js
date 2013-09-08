window.PixelQuest.Renderers.House = (function() {
  "use strict"

  var Renderer = function(id, object) {
    this.id     = id
    this.object = object
  }

  Renderer.prototype.render = function(ctx) {
    renderRoof.call(this, ctx)
    renderWalls.call(this, ctx)
  }

  // fake for an update method.
  // houses don't need updates!
  Renderer.prototype.update = function(){}

  /////////////
  // private //
  /////////////

  var renderRoof = function(ctx) {
    return
    var px   = 3
      , opts = this.object.options

    ctx.fillStyle = '#34495e'

    // triangle
    for (var i = 0; i < 7; i++) {
      ctx.fillRect(opts.x + i * px, opts.y + (7 - i) * px, px, px)
      ctx.fillRect(opts.x + (13-i) * px, opts.y + (7 - i) * px, px, px)
    }
    ctx.fillRect(opts.x + px, opts.y + 7 * px, px * 12, px)

    // chimney
    ctx.fillRect(opts.x + 9 * px, opts.y + px, px * 3, px)
    ctx.fillRect(opts.x + 9 * px, opts.y + 2 * px, px, px)
    ctx.fillRect(opts.x + 11 * px, opts.y + 2 * px, px, 3 * px)
    ctx.fillStyle = '#c0392b'
    ctx.fillRect(opts.x + 10 * px, opts.y + 2 * px, px, 2 * px)



  }

  var renderWalls = function(ctx) {

  }

  return Renderer
})()
