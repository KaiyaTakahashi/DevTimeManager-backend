const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController.js');

router.post('/insert', tasksController.insertTasks);
router.get('/get', tasksController.getTasks);
router.delete('/delete', tasksController.deleteTasks);
router.post('/update', tasksController.updateTasks);
router.get('/getAllTasks', tasksController.getAllTasks);

module.exports = router;