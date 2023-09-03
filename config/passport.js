const User = require('../model/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const fbStrategy = require('passport-facebook').Strategy
const googleStrategy = require('passport-google-oauth20').Strategy
const githubStrategy = require('passport-github2').Strategy

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  // 本地登入
  passport.use(new LocalStrategy({
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, account, password, done) => {
    try {
      const user = await User.findOne({ account })
      if (!user) return done(null, false, req.flash('dangerMsg', '該帳號尚未註冊'))
      const checkUser = await bcrypt.compare(password, user.password)
      if (!checkUser) return done(null, false, req.flash('dangerMsg', '帳號或密碼錯誤'))
      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  }))

  // FB登入
  passport.use(new fbStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.FB_CALLBACK,
    profileFields: ['email', 'displayName']
  }, async (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json
    try {
      const user = await User.findOne({ account: email })
      if (user) return done(null, user)

      const randomPassword = Math.random().toString(36).slice(2, 12)
      const newUser = await User.create({ name, account: email, password: bcrypt.hashSync(randomPassword, 12) })
      return done(null, newUser)
    } catch (err) {
      return done(err, false)
    }
  }
  ))

  // google登入
  passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    profileFields: ['email', 'displayName']
  }, async (accessToken, refreshToken, profile, cb) => {
    const { email, name } = profile._json
    try {
      const user = await User.findOne({ account: email })
      if (user) return done(null, user)

      const randomPassword = Math.random().toString(36).slice(2, 12)
      const newUser = await User.create({ name, account: email, password: bcrypt.hashSync(randomPassword, 12) })
      return done(null, newUser)
    } catch (err) {
      return done(err, false)
    }
  }))

  // github 登入
  passport.use(new githubStrategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK,
    profileFields: ['email', 'displayName'],
  }, async (accessToken, refreshToken, profile, done) => {
    const { name, id } = profile._json
    try {
      const user = await User.findOne({ account: id })
      if (user) return done(null, user)

      const randomPassword = Math.random().toString(36).slice(2, 12)
      const newUser = await User.create({ name, account: id, password: bcrypt.hashSync(randomPassword, 12) })
      return done(null, newUser)
    } catch (err) {
      return done(err, false)
    }
  }
  ))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user.toJSON())
    } catch (err) {
      done(err, null)
    }
  })
}