const mysql = require("mysql");

const db_config = {
    connectionLimit: 100,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true,
};

const pool = mysql.createPool(db_config);

// const mysqlConnection = mysql.createConnection(db_config);

// mysqlConnection.connect((err, connection) => {
//     if (err) {
//         connection.release();
//         console.log("Connection Failed!" + JSON.stringify(err, undefined, 2));
//     } else {
//         console.log("Connection Established Successfully");
//     }
// });

// module.exports = mysqlConnection;

module.exports = pool;
