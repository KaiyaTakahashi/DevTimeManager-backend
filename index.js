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
    methods: ["GET", "POST", "DELETE"],
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
    console.log(date)
    console.log(time)
    pool.query('INSERT INTO tasks (task_name, date, time, is_finished) VALUES ($1, $2, $3, $4)',
                [taskName, date, time, isFinished],
                (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    res.send(result);
    })
});

/* Insert task to weekly_tasks */
app.post("/weekly_tasks/insert", (req, res) => {
    const { date, value } = req.body;
    console.log(date)
    pool.query('INSERT INTO weekly_tasks (date, value) VALUES ($1, $2)',[date, value], (err, result) => {
        if (err) {
            console.log(err)
        }
        res.send(result);
    })
});

/* Insert task to weekly_tasks */
app.get("/weekly_tasks/get", (req, res) => {
    const selectQuery = "SELECT * FROM weekly_tasks";
    pool.query(selectQuery, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    })
});

app.get('/tasks/get', (req, res) => {
    const selectQuery = "SELECT * FROM tasks";
    pool.query(selectQuery, (err, result) => {
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
        localStorage.setItem("refresh_token", tokens.refresh_token);
        console.log(tokens)
        res.send(tokens);
    } catch(err) {
        res.send(err);
    }
})

app.post('/create_event', async (req, res) => {
    try {
        const { summary, description, location, startDateTime, endDateTime } = req.body;
        oauth2Client.setCredentials({refresh_token: localStorage.getItem("refresh_token")});
        const calendar = google.calendar('v3');
        const response = await calendar.events.insert({
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
        })
        res.send(response);
    } catch(err) {
        console.log(err)
    }
});

app.listen(3001, () => {
    console.log("running server");
})