const express = require('express');
const router = express.Router();
const { checkToken } = require("../auth/token_validation")
const { showCurrentLevel, levelUp } = require('../controllers/flashCtrl')

//Show, Increment Level Progress, Insert Next Level if progress is equal to lesson count where lesson.level_id = user_level.level_id
router.get('/getLevels', checkToken, showCurrentLevel)
router.post('/nextLevel', checkToken, levelUp)
    // router.patch('/addProgress', checkToken, showCurrentLevel)

//Show Lessons Per Level, Insert into user_lesson if lesson is completed, 
// router.get('/getLesson', checkToken, showCurrentLevel)
// router.post('/completeLevel', checkToken, completeLesson)

//Show Flashcards per lesSsons




module.exports = router;