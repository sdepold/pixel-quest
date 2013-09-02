window.PixelQuest.Utils = {
  extend: function(obj, extension) {
    var result = {}

    Object.keys(obj).forEach(function(key) {
      result[key] = obj[key]
    })

    Object.keys(extension).forEach(function(key) {
      if (extension[key] === Object(extension[key])) {
        result[key] = PixelQuest.Utils.extend(result[key], extension[key])
      } else {
        result[key] = extension[key]
      }
    })

    return result
  }
}
