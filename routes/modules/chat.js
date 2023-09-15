const router = require('express').Router()
const chatController = require('../../controller/chat')

router.get('/:Aid/:Pid', chatController.oneOnOne)
router.get('/', chatController.normalChat)

module.exports = router