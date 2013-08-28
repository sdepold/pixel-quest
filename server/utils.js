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
  }
}
