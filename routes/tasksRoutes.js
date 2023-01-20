const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController.js');

router.post('/tasks/insert', tasksController.insertTasks);
router.get('/tasks/get', tasksController.getTasks);
router.delete('/tasks/delete', tasksController.deleteTasks);
router.post('/tasks/update', tasksController.updateTasks);

module.exports = router;