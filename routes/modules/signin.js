const express = require('express')
const router = express.Router()
const passport = require('passport')

// FB signin
router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: '/chat', failureRedirect: '/signin', failureFlash: true }))
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }))
// Google signin
router.get('/google/callback', passport.authenticate('google', { successRedirect: '/chat', failureRedirect: '/signin', failureFlash: true }))
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
// Github signin
router.get('/github/callback', passport.authenticate('github', { successRedirect: '/chat', failureRedirect: '/signin', failureFlash: true }))
router.get('/github', passport.authenticate('github', { scope: ['email', 'public_profile'] }))
// Local signin
router.post('/', passport.authenticate('local', { successRedirect: '/chat', failureRedirect: '/signin', failureFlash: true }))
router.get('/', (req, res) => { return res.render('signin') })

module.exports = router