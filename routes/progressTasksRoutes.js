const express = require('express');
const router = express.Router();
const progressTasksController = require('../controllers/progressTasksController.js');

router.get('/get', progressTasksController.getProgressTasks);
router.post('/insert', progressTasksController.insertProgressTasks);

module.exports = router;