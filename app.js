var Server = require('./server/lib/server.js')
new Server().listen(process.env.PORT || 3000)
