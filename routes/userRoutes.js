const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.post('/users/insert', userController.insertUser);
router.post('/users/create_event', userController.createEvent);

module.exports = router;