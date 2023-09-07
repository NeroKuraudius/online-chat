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
const { authenticator } = require('./middleware/auth.js')
const passport = require('passport')
const bcrypt = require('bcryptjs')
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


// router
// FB signin
app.get('/signin/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/signin', failureFlash: true }))
app.get('/signin/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }))
// Google signin
app.get('/signin/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/signin', failureFlash: true }))
app.get('/signin/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
// Github signin
app.get('/signin/github/callback', passport.authenticate('github', { successRedirect: '/', failureRedirect: '/signin', failureFlash: true }))
app.get('/signin/github', passport.authenticate('github', { scope: ['email', 'public_profile'] }))
// Local signin
app.get('/signin', (req, res) => { return res.render('signin') })
app.post('/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin', failureFlash: true }))
// Signup
app.post('/signup', async (req, res) => {
  const { account, name, password, passwordCheck } = req.body
  if (!account.trim() || !name.trim() || !password.trim() || !passwordCheck.trim()) {
    req.flash('dangerMsg', '所有欄位皆不得為空')
    return res.redirect('/signin')
  }
  if (password !== passwordCheck) {
    req.flash('dangerMsg', '兩次輸入密碼不一致')
    return res.redirect('/signin')
  }
  try {
    const registeredUser = await User.findOne({ account })
    if (registeredUser) {
      req.flash('dangerMsg', '該Email已註冊')
      return res.redirect('/signin')
    }
    await User.create({ account, name, password: bcrypt.hashSync(password, 12) })
    req.flash('successMsg', '註冊成功，請以新帳號登入')
    return res.redirect('/signin')
  } catch (err) {
    console.log(`signup error: ${err}`)
  }
})
// Signout
app.post('/signout', authenticator, (req, res, next) => {
  req.logOut(err => {
    if (err) return next(err)
    req.flash('successMsg', '已成功登出')
    return res.redirect('/signin')
  })
})
// Homepage
app.get('/', authenticator, (req, res) => {
  const { user } = req
  delete user.password
  return res.render('chat', { user })
})


// socket
let onlineCounts = 0
let onlineUsers = []
io.on('connection', (socket) => {
  onlineCounts += 1
  io.emit('online', onlineCounts)

  let userAccount = ''
  socket.on('userOn', account => {
    if (!onlineUsers.includes(account)) {
      onlineUsers.push(account)
    }
    const userNameList = []
    onlineUsers.forEach(async(account) => {
      const user = await User.findOne({ account }).lean()
      userNameList.push(user.name)
      userAccount = account
      io.emit('showUsers', userNameList)
    })
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


const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`App is listening on ${port}.`)
})