const express = require("express");
const mysql = require("mysql");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors({ limit: "50mb" }));
// ----------------------------
// MySql db
// ----------------------------
// TODO;  SET MYSQL FIRST!
// const db = mysql.createConnection({
//     host: process.env.HOST, // No pot ser estatic
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     port: 3306,
// });
// ----------------------------
// Storage
// ----------------------------
app.use("/images", express.static("images"));
app.use("/pdfs", express.static("pdfs"));
// ----------------------------
// Routes
// ----------------------------
// Comments
app.use("/api", require("./modules/comments"));
// ---------------------------------------------
// Middleware para Vue.js router mode history
// ---------------------------------------------
const history = require("connect-history-api-fallback");
app.use(history());
app.use(express.static(path.join(__dirname, "cdn")));
// ---------------------------------------------
// Check db
// ---------------------------------------------
db.connect((error) => {
    if (error) {
        console.log("Error:", error);
    }
    else {
        console.log("Database server running!");
    }
});
// ---------------------------------------------
// App working
// ---------------------------------------------
if (process.env.NODE_ENV) {
    // SSL CERTIFICATE
    const server = https.createServer({
    // key: fs.readFileSync("/etc/letsencrypt/live/examenselectivitat.cat/privkey.pem"),
    // cert: fs.readFileSync("/etc/letsencrypt/live/examenselectivitat.cat/fullchain.pem"),
    }, app);
    server.listen(PORT, () => {
        console.log(`------------------------------ PRODUCTION MODE -----------------------------`);
    });
}
else {
    app.listen(PORT, () => {
        console.log(`----------------------------- DEVELOPMENT MODE -----------------------------`);
    });
}
module.exports.db = db;
//# sourceMappingURL=app.js.map