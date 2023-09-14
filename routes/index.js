const express = require('express')
const router = express.Router()
const { authenticator } = require('./middleware/auth.js')
const bcrypt = require('bcryptjs')
const User = require('./model/User.js')
const signin = require('./modules/signin.js')
const chatWith = require('./modules/chat-with')

// routes:
router.use('/chat-with', chatWith)
router.use('/signin',signin)

// single route:
// signup
router.post('/signup', async (req, res) => {
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
// signout
router.post('/signout', authenticator, (req, res, next) => {
  req.logOut(err => {
    if (err) return next(err)
    req.flash('successMsg', '已成功登出')
    return res.redirect('/signin')
  })
})
// homepage
router.get('/', authenticator, (req, res) => {
  const { user } = req
  delete user.password
  return res.render('chat', { user })
})

router.get('',(req,res)=>res.redirect('/'))

module.exports = router