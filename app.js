var HttpServer    = require('./server/lib/http-server.js')
  , WebSocket = require('./server/lib/websocket-server.js')

var server = new HttpServer()
  , socket = new WebSocket(server)

socket.listen()
server.listen(process.env.PORT || 3000)
