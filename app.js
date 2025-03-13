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
const User = require('./models/User.js')


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
  next()
})

// routes
app.use(routes)

// socket
let onlineUsers = []
io.on('connection', (socket) => {
  io.emit('online')

  let userAccount
  socket.on('userOn', async(loginUser) => {
    if (!onlineUsers.includes(loginUser.account)) {
      onlineUsers.push(loginUser.account)

      const systemInfo = { name:'系統', msg:`${loginUser.name}上線囉，快來和他打招呼吧！`}
      io.emit('msg',systemInfo)
    }

    userAccount = loginUser.account
    const userNameList = await gatherOnlineUsersName(onlineUsers)

    io.emit('showUsers', userNameList)
  })

  socket.on('participateChat', async (data) => {
    const userA = await User.findById(data.Aid).lean()
    const userB = await User.findById(data.Pid).lean()
    delete userA.password
    delete userB.password

    const roomId = [data.Aid, data.Pid].sort().join('/')
    socket.join(roomId)
    io.to(roomId).emit('showParticipator', { userA, userB })
  })

  socket.on('send', msg => {
    io.emit('msg', msg)
  })

  socket.on('disconnect', async() => {
    const leftUserIndex = onlineUsers.indexOf(userAccount)
    if (leftUserIndex !== -1) onlineUsers.splice(leftUserIndex,1)
    
    const userNameList = await gatherOnlineUsersName(onlineUsers)
    io.emit('showUsers', userNameList)
  })

  // ============================================//
  async function gatherOnlineUsersName(userArray){
    const userPromises = userArray.map(async (account) => {
      const user = await User.findOne({ account }).lean()
      if (user) {
          delete user.password
          return { account, name: user.name, id: user._id }
      }
      return null
    })

    const newList = (await Promise.all(userPromises)).filter(Boolean)
    return newList
  }
})

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000
server.listen(port, () => {
  console.log(`App is listening on ${port}.`)
})