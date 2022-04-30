const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const https = require("https");

const app = express();
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb"}));
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors({limit: "50mb"}));

// ----------------------------
// MySql db
// ----------------------------

// TODO;  SET MYSQL FIRST!




// ----------------------------
// Storage
// ----------------------------

// app.use("/images", express.static("images"));
// app.use("/pdfs", express.static("pdfs"));

// ----------------------------
// Routes
// ----------------------------

// Motos
app.use("/api", require("./modules/motos"));

// ---------------------------------------------
// Middleware para Vue.js router mode history
// ---------------------------------------------

const history = require("connect-history-api-fallback");
app.use(history());
app.use(express.static(path.join(__dirname, "cdn")));


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
} else {
    app.listen(PORT, () => {
        console.log(`----------------------------- DEVELOPMENT MODE (PORT ${PORT}) -----------------------------`);
    });
}

