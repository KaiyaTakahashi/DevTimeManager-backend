// Libraries
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const tasksRoutes = require('./routes/tasksRoutes.js');
const progressTasksRoutes = require('./routes/progressTasksRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
// Set up dotenv
require('dotenv').config();

// middleware
// app.use(cors({
//     origin: ['https://dev-time-manager-api.onrender.com', 'https://dancing-taiyaki-47a928.netlify.app', 'https://dancing-taiyaki-47a928.netlify.app/' ,'http://localhost:3000', 'https://dev-time-manager-api.onrender.com:'],
//     methods: ["GET", "POST", "DELETE", "UPDATE"],
//     credentials: true,
// }))
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.static('build'))
// Set up Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Use routes
app.use('/tasks', tasksRoutes);
app.use('/progress_tasks', progressTasksRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("running server on", PORT);
})