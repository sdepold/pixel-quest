module.exports = {
  extend: function(obj, extension, filter) {
    var result = {}
      , self   = this

    Object.keys(obj).forEach(function(key) {
      result[key] = obj[key]
    })

    Object.keys(extension).forEach(function(key) {
      if (!filter || (filter.indexOf(key) !== -1)) {
        if ((extension[key] === Object(extension[key])) && !Array.isArray(extension[key])) {
          result[key] = self.extend(result[key], extension[key])
        } else {
          result[key] = extension[key]
        }
      }
    })

    return result
  },

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
  },

  lzw_encode: function(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
      currChar=data[i];
      if (dict[phrase + currChar] != null) {
        phrase += currChar;
      }
      else {
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        dict[phrase + currChar] = code;
        code++;
        phrase=currChar;
      }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
      out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
  },

  // Decompress an LZW-encoded string
  lzw_decode: function(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
      var currCode = data[i].charCodeAt(0);

      if (currCode < 256) {
        phrase = data[i];
      } else {
       phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
      }

      out.push(phrase);
      currChar = phrase.charAt(0);
      dict[code] = oldPhrase + currChar;
      code++;
      oldPhrase = phrase;
    }
    return out.join("");
  }
}
