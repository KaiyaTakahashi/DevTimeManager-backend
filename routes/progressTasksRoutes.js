const express = require('express');
const router = express.Router();
const progressTasksController = require('../controllers/progressTasksController.js');

router.get('/progress_tasks/get', progressTasksController.getProgressTasks);
router.post('/progress_tasks/insert', progressTasksController.insertProgressTasks);

module.exports = router;