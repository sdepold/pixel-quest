var HttpServer = require('./server/http-server.js')
  , WebSocket  = require('./server/websocket-server.js')

var server = new HttpServer()
  , socket = new WebSocket(server)

socket.listen()
server.listen(process.env.PORT || 3000)
