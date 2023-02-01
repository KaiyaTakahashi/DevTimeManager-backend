const pool = require('../db/db.js');
require('dotenv').config();

// Set up google api
const { google } = require('googleapis');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SERCRET = process.env.GOOGLE_CLIENT_SERCRET;
const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SERCRET,
        'https://dancing-taiyaki-47a928.netlify.app'
)

exports.insertUser = async (req, res, next) => {
    if (req.body.code) {
        const code = req.body.code;
        try {
            const {tokens} = await oauth2Client.getToken(code);
            if (tokens.refresh_token) {
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
    } else {
        res.send();
    }
};

exports.createEvent = async (req, res) => {
    const {email} = req.body
    pool.query("SELECT refresh_token FROM users WHERE email = $1", [email], (err, result) => {
        oauth2Client.setCredentials({refresh_token: result.rows[0].refresh_token});
        const { summary, description, location, startDateTime } = req.body;
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
};

exports.getAllUser = (req, res) => {
    console.log(pool)
    pool.query("SELECT * from users", (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
    })
}