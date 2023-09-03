module.exports = {
  errorHandler(err, req, res, next) {
    if (err instanceof Error) req.flash('errorMsg', `${err.message}`)
    res.redirect('back')
    next(err)
  }
}