const chatController = {
  normalChat: (req, res) => {
    const { user } = req
    delete user.password
    return res.render('chat', { user })
  },
  oneOnOne: (req, res) => {
    const { user } = req
    const { Aid, Pid } = req.params
    delete user.password
    return res.render('privateChat', { user })
  }
}

module.exports = chatController