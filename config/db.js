const mysql = require("mysql");

const mysqlConnection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true,
});

mysqlConnection.connect((err) => {
    if (!err) console.log("Connection Established Successfully");
    else console.log("Connection Failed!" + JSON.stringify(err, undefined, 2));
});

module.exports = mysqlConnection;
