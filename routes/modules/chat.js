const router = require('express').Router()
const chatControll = require('../../controller/chatController')

router.get('/:id', chatControll.oneOnOne)
router.get('/', (req, res) => {
  const { user } = req
  delete user.password
  return res.render('chat', { user })
})

module.exports = router