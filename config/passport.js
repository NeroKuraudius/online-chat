const User = require('../model/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


modeule.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email })
      if (!user) return done(null, false, req.flash('dangerMsg', '該帳號尚未註冊'))
      const checkUser = await bcrypt.compare(password, user.password)
      if (!checkUser) return done(null, false, req.flash('dangerMsg', '帳號或密碼錯誤'))
      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user.lean())
    } catch (err) {
      done(err, null)
    }
  })
}