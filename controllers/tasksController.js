const pool = require('../db/db.js');

exports.insertTasks = (req, res) => {
    const taskName = req.body.taskName;
    const date = req.body.date;
    const time = req.body.time;
    const isFinished = req.body.isFinished;
    const email = req.body.email;
    pool.query('INSERT INTO tasks (task_name, time, is_finished, date, email) VALUES ($1, $2, $3, $4, $5)',
                [taskName, time, isFinished, date, email],
                (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    res.send(result);
    })
}

exports.getTasks = (req, res) => {
    const email = req.query.email;
    const selectQuery = "SELECT * FROM tasks WHERE email = $1";
    pool.query(selectQuery, [email], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    })
}

exports.deleteTasks = (req, res) => {
    const id = req.body.id;
    const deleteQuery = "DELETE FROM tasks WHERE task_id = $1";
    pool.query(deleteQuery, [id], (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
    })
};

exports.updateTasks = (req, res) => {
    const isFinished = req.body.isFinished;
    const taskId = req.body.taskId;
    const updateQuery = "UPDATE tasks SET is_finished = $1 WHERE task_id = $2"
    pool.query(updateQuery, [isFinished, taskId], (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
    })
};