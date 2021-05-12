const mysql = require("mysql");

var connection_parameters = {
    host: 'localhost',
    port: '3306',
    user: 'user',
    password: 'password',
    database: 'cronDB'
};

function createConnection(){
    return mysql.createConnection(connection_parameters)
}

exports.storeRecord = function storeRecord() {

    var query = 'UPDATE record WHERE ID=1 SET cronrecord=' + JSON.stringify(cronRecord);
    connection.query(query, function (err, result) {
        // cronRecord is now stored in database table
        connection.end();
    });
}

exports.readRecord = function readRecord() {
    /* reads cronRecord object from the MySQL database
     * given a database "appdb" with the table "record"
     * readRecord should be executed whenever the app is 
     * started
     */

    // var connection = mysql.createConnection({
    //     host: 'localhost',
    //     user: 'user',
    //     password: 'password'
    // });

    // connection.connect();

    var query = 'SELECT record FROM cronrecord WHERE ID=1';
    connection.query(query, function (err, result) {
        cronRecord = JSON.parse(result[0]);
        connection.end();
    });
}

module.exports = {
    storeRecord, readRecord
}