const router = require('express').Router()
const chatController = require('../../controller/chat')

router.get('/ai',chatController.toAI)
router.get('/:Aid/:Pid', chatController.oneOnOne)
router.get('/', chatController.normalChat)

module.exports = router