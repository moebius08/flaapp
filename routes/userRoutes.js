const express = require('express');
const { createUser, getAllUser, getUserbyId, updateUserbyId, deleteUserbyId, login } = require('../controllers/userCtrl')
const router = express.Router();
const { checkToken } = require("../auth/token_validation")



router.get('/hello', (req, res) => {
    res.send("hello")
})

router.post('/signup', createUser)
router.get('/getAllUser', checkToken, getAllUser)
router.get('/:id', checkToken, getUserbyId)
router.patch('/update/user', checkToken, updateUserbyId);
router.delete('/delete', checkToken, deleteUserbyId);
router.post('/login', login);



module.exports = router;