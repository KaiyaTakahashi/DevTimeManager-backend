const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.post('/insert', userController.insertUser);
router.post('/create_event', userController.createEvent);
router.get('/getAllUsers', userController.getAllUser);

module.exports = router;