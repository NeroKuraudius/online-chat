module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('dangerMsg', '使用前請先登入')
    return res.redirect('/signin')
  }
}