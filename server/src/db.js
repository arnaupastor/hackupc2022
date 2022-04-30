const pgp = require('pg-promise')();
const fs = require("fs");

const connectionConf = {
    host: 'hackupc22-do-user-11481145-0.b.db.ondigitalocean.com',
    port: 25060,
    database: 'defaultdb',
    user: 'doadmin',
    password: 'AVNS_XO01pWSFp3l7GMA',
    ssl: {
        ca   : fs.readFileSync("src/ca-certificate.crt").toString(),
    }

};
const sql = pgp(connectionConf);


module.exports.sql = sql;
