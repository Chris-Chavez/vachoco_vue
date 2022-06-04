const mysql = require('mysql');

const objectConnection = {
    "host": "db-mysql-vachoco-do-user-11722385-0.b.db.ondigitalocean.com",
    "port": 25060,
    "user": "doadmin",
    "password": "AVNS_DMWGfWUBlEpqeFs",
    "database": "vachoco"
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