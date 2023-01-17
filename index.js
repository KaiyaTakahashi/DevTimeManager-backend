// Libraries
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// Configure database
const Pool = require('pg').Pool;
const pool = new Pool({
    user: "postgres",
    password: "password",
    host: "localhost",
    port: 5432,
    database: "dev_time_manager_db",
})

const app = express();

// Set up cors
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "UPDATE"],
    credentials: true,
}))

// Set up localStorage
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

// Set up Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Set up dotenv
require('dotenv').config();

// Set up google api
const { google } = require('googleapis');
const GOOGLE_CLIENT_ID = '985770492377-a2nlp1h94mi7s7v861khiturmfqs9gsm.apps.googleusercontent.com';
const GOOGLE_CLIENT_SERCRET = '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';
const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SERCRET,
        'http://localhost:3000'
)

// const path = require('path');
// app.use(express.static(path.join(__dirname + "/public")));

// tasks/insert
app.post('/tasks/insert', (req, res) => {
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
});

/* Insert task to progress_tasks */
app.post("/progress_tasks/insert", (req, res) => {
    const { date, value, email } = req.body;
    pool.query('INSERT INTO progress_tasks (date, value, email) VALUES ($1, $2, $3)',[date, value, email], (err, result) => {
        if (err) {
            console.log(err)
        }
        res.send(result);
    })
});

/* get task to progress_tasks */
app.get("/progress_tasks/get", (req, res) => {
    const email = req.query.email;
    const selectQuery = "SELECT * FROM progress_tasks WHERE email = $1";
    pool.query(selectQuery, [email], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    })
});

/* Delete task from progress_task */
app.delete('/delete', (req, res) => {
    const id = req.body.id;
    const deleteQuery = "DELETE FROM tasks WHERE task_id = $1";
    pool.query(deleteQuery, [id], (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
    })
})

/* Update the task from progress_task */
app.post('/tasks/update', (req, res) => {
    const isFinished = req.body.isFinished;
    const taskId = req.body.taskId;
    const updateQuery = "UPDATE tasks SET is_finished = $1 WHERE task_id = $2"
    pool.query(updateQuery, [isFinished, taskId], (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
    })
})

app.get('/tasks/get', (req, res) => {
    const email = req.query.email;
    const selectQuery = "SELECT * FROM tasks WHERE email = $1";
    pool.query(selectQuery, [email], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    })
})

// Refresh Token
// Need to change, store this to databe
app.post('/api/create_tokens', async (req, res, next) => {
    const {code} = req.body;
    try {
        const {tokens} = await oauth2Client.getToken(code);
        if (tokens.refresh_token) {
            // localStorage.setItem("refresh_token", tokens.refresh_token);
            const idToken = tokens.id_token;
            const base64Url = idToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payloadinit = new Buffer.from(base64, 'base64').toString('ascii');
            const payload = JSON.parse(payloadinit)
            const email = payload.email;
            pool.query("INSERT INTO users (email, refresh_token) VALUES ($1, $2)", 
            [email, tokens.refresh_token], (err, result) => {
            })
        }
        res.send(tokens);
    } catch(err) {
        res.send(err);
    }
})

app.post('/create_event', async (req, res) => {
    const {email} = req.body
    pool.query("SELECT refresh_token FROM users WHERE email = $1", [email], (err, result) => {
        oauth2Client.setCredentials({refresh_token: result.rows[0].refresh_token});
        const { summary, description, location, startDateTime, endDateTime } = req.body;
        const calendar = google.calendar('v3');
        calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            requestBody: {
                summary: summary,
                description: description,
                location: location,
                colorId: '2',
                start: {
                    dateTime: startDateTime,
                },
                end: {
                    dateTime: new Date(),
                }
            }
        }, function(err, event) {
            if(err) {
                console.log("err: ", err);
                return;
            }
        })
    })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("running server");
})