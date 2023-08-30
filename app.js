require('./config/mongoose.js')

const express = require('express')
const app = express()
const { Server } = require('http')
const server = Server(app)
const socketio = require('socket.io')
const io = socketio(server)
const exphbs = require('express-handlebars')

app.engine('hbs',exphbs.engine({extname:'.hbs',defaultLayout:'index.hbs'}))
app.set('view engine','hbs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  return res.render('chat')
})

let onlineCounts = 0
io.on('connection', (socket) => {
  onlineCounts += 1
  io.emit('online', onlineCounts)
  
  socket.on('send',(msg)=>{
    io.emit('msg',msg)
  })

  socket.on('disconnect', () => {
    onlineCounts = onlineCounts < 0 ? 0 : onlineCounts -= 1
    io.emit("online", onlineCounts)
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`App is listening on ${port}.`)
})