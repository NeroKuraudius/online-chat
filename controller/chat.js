const User = require('../models/User')

const chatController = {
  normalChat: (req, res) => {
    const { user } = req
    delete user.password
    return res.render('chat', { user })
  },
  oneOnOne: async (req, res) => {
    const { user } = req
    const { Aid, Pid } = req.params
    delete user.password
    return res.render('privateChat', { user, Aid, Pid })
  },
  toAI: async(req,res)=>{
    const { user } = req

    return res.render('aiChat', { user })
  }
}

module.exports = chatController