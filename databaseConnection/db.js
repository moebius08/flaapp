const mysql = require('mysql')
const config = require('./connection');

const db = mysql.createConnection(config);

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("DB Connected Successfuly")
    }
})

module.exports = db;