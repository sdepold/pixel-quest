module.exports = {
  log: function(s) {
    console.log(new Date().toISOString() + ":", s)
  },

  contentTypeForUrl: function(url) {
    if (url.match(/\.css$/)) {
      return "text/css"
    } else if (url.match(/\.js$/)) {
      return "text/javascript"
    } else if (url === '/') {
      return "text/html"
    }
  },

  generateIdentifier: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    })
  }
}
