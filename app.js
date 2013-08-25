var Server    = require('./server/lib/server.js')
  , WebSocket = require('./server/lib/websocket-server.js')

var server = new Server()
  , socket = new WebSocket(server)

socket.listen()
server.listen(process.env.PORT || 3000)
