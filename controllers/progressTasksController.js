const pool = require('../db/db.js');

exports.getProgressTasks = (req, res) => {
    const email = req.query.email;
    const selectQuery = "SELECT * FROM progress_tasks WHERE email = $1";
    pool.query(selectQuery, [email], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    })
};

exports.insertProgressTasks = (req, res) => {
    const { date, value, email } = req.body;
    pool.query("INSERT INTO progress_tasks (date, value, email) VALUES ($1, $2, $3)",[date, value, email], (err, result) => {
        if (err) {
            console.log(err)
        }
        res.send(result);
    })
};