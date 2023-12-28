const express = require('express');
const router = express.Router();
const { checkToken } = require("../auth/token_validation")
const { showCurrentLevel, levelUp, increment, getAllLessons, completeLesson } = require('../controllers/flashCtrl')

//Show, Increment Level Progress, Insert Next Level if progress is equal to lesson count where lesson.level_id = user_level.level_id
router.get('/getLevels', checkToken, showCurrentLevel)
router.post('/nextLevel', checkToken, levelUp)
    //To be combined from completing a lesson

//Show Lessons Per Level, Insert into user_lesson if lesson is completed,
router.get('/getLesson', checkToken, getAllLessons) // level id babato
router.post('/lesson-complete', checkToken, completeLesson) // lesson id and level ID babato

//Show lessons chuchu box




module.exports = router;