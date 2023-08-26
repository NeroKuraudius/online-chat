const express = require('express')
const app = express()
const { Server } = require('http')
const server = Server(app)
const socketio = require('socket.io')
const io = socketio(server)

app.use(express.static('public'))

app.get('/',(req,res)=>{
  return res.sendFile(__dirname+'/app.html')
})

io.on('connection',(socket)=>{
  console.log('Hello, world!')

  socket.on('Greet',()=>{
    socket.emit('Greet','Catch you, client!')
  })

  socket.on('disconnect',()=>{
    console.log('Good bye, world!')
  })
})

const port = process.env.PORT || 3000
server.listen(port,()=>{
  console.log(`App is listening on ${port}`)
})