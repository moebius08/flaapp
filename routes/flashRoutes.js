const express = require('express');
const router = express.Router();
const { checkToken } = require("../auth/token_validation")
const { showCurrentLevel } = require('../controllers/flashCtrl')

router.get('/getLevels', checkToken, showCurrentLevel)


module.exports = router;