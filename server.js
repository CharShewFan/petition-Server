require('dotenv').config('./.env');
const db = require('./config/db');
const express = require('./config/express');
const bcrypt = require('bcryptjs')



const app = express();
const port = process.env.PORT || 4129;

// Test connection to MySQL on start-up
async function testDbConnection() {
    try {
        await db.createPool();
        await db.getPool().getConnection();
    } catch (err) {
        console.error(`Unable to connect to MySQL: ${err.message}`);
        process.exit(1);
    }
}

testDbConnection()
    .then(function () {
        app.listen(port, function () {
            console.log(`Listening on port: http://localhost:${port}`);
        });
    });

