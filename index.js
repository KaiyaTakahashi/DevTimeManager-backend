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
    database: "dev_time_manager",
})

const app = express();

// Set up cors
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
}))

// Set up Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Set up dotenv
require('dotenv').config();



// const path = require('path');
// app.use(express.static(path.join(__dirname + "/public")));

app.get('/api/get', (req, res) => {

})

app.listen(3001, () => {
    console.log("running server");
})