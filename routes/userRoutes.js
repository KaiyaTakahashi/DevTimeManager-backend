const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.post('/insert', userController.insertUser);
router.post('/create_event', userController.createEvent);

module.exports = router;