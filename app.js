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
const { authenticator } = require('./auth.js')
const passport = require('passport')

app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'index.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }))

signinPassport(app)

app.use(flash())
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.dangerMsg = req.flash('dangerMsg')
  res.locals.successMsg = req.flash('successMsg')
  next()
})


app.get('/signin', (req, res) => {
  return res.render('signin')
})
app.post('/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin', failureFlash: true }))

app.post('/signout', authenticator, (req, res, next) => {
  req.logOut(err => {
    if (err) return next(err)
    req.flash('successMsg', '已成功登出')
    return res.redirect('/signin')
  })
})

app.get('/', authenticator, (req, res) => {
  return res.render('chat')
})

let onlineCounts = 0
io.on('connection', (socket) => {
  onlineCounts += 1
  io.emit('online', onlineCounts)

  socket.on('send', (msg) => {
    io.emit('msg', msg)
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