window.PixelQuest.Utils = {
  extend: function(obj, extension) {
    var result = {}

    Object.keys(obj).forEach(function(key) {
      result[key] = obj[key]
    })

    Object.keys(extension).forEach(function(key) {
      result[key] = extension[key]
    })

    return result
  }
}
