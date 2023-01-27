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
app.use(cors({
    origin: ["https://dev-time-manager-api.onrender.com", "https://dancing-taiyaki-47a928.netlify.app", "http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "UPDATE"],
    credentials: true,
}))
app.use(express.static('build'))
// Set up Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Use routes
app.use(tasksRoutes);
app.use(progressTasksRoutes);
app.use(userRoutes);

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "HOST";
app.listen(PORT, () => {
    console.log("running server on", PORT);
    console.log("running server on", HOST);
})