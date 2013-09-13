var HttpServer = require('./http-server.js')
  , WebSocket  = require('./websocket-server.js')

var server = new HttpServer()
  , socket = new WebSocket(server)

socket.listen()
server.listen(process.env.PORT || 3000)
