const mysql = require('mysql');

const objectConnection = {
    "host": "db-vachoco-do-user-11722385-0.b.db.ondigitalocean.com",
    "port": 25060,
    "user": "vachoco",
    "password": "AVNS_0asJA4mK5Yga9hc",
    "database": "defaultdb"
}

const myConn = mysql.createConnection(objectConnection);

myConn.connect((error) => {
    if (error) {
        console.log("Ha ocurrido un error", error);
    } else {
        console.log("Base de datos conectada");
    }
})

module.exports = myConn;