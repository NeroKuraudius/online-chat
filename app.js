require('./config/mongoose.js')

const express = require('express')
const app = express()
const { Server } = require('http')
const server = Server(app)
const socketio = require('socket.io')
const io = socketio(server)
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const signinPassport = require('./config/passport.js')
const routes = require('./routes')
const User = require('./model/User.js')


// view engine
app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'index.hbs' }))
app.set('view engine', 'hbs')

// imported module
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }))

// passport
signinPassport(app)

// hint message
app.use(flash())
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.dangerMsg = req.flash('dangerMsg')
  res.locals.successMsg = req.flash('successMsg')
  res.locals.errorMsg = req.flash('errorMsg')
  next()
})

// routes
app.use(routes)

// socket
let onlineCounts = 0
let onlineUsers = []
io.on('connection', (socket) => {
  onlineCounts += 1
  io.emit('online', onlineCounts)

  let userAccount, userId
  socket.on('userOn', account => {
    if (!onlineUsers.includes(account)) {
      onlineUsers.push(account)
    }
    const userNameList = []
    onlineUsers.forEach(async (account) => {
      const user = await User.findOne({ account }).lean()
      delete user.password
      userNameList.push({ account, name: user.name, id: user._id })
      userAccount = account
      userId = user._id
      io.emit('showUsers', userNameList)
    })
  })

  socket.on('participateChat', async (data) => {
    const userA = await User.findById(data.Aid)
    const userB = await User.findById(data.Pid)
    delete userA.password
    delete userB.password
    socket.join(userId)
    io.to(userId).emit('showParticipator', { userA, userB })
  })



  socket.on('send', msg => {
    io.emit('msg', msg)
  })

  socket.on('disconnect', () => {
    onlineCounts = onlineCounts < 0 ? 0 : onlineCounts -= 1
    if (onlineUsers.includes(userAccount)) {
      onlineUsers.splice(onlineUsers.indexOf(userAccount), 1)
    }
    io.emit('online', onlineCounts)
    io.emit('showUsers', onlineUsers)
  })
})

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 4000
server.listen(port, () => {
  console.log(`App is listening on ${port}.`)
})