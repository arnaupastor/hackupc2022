const express = require("express");
const router = express.Router();
const {sql} = require("../db.js");
const motos = require("./motos.json");

// --------------------------
// Generate users
// --------------------------

router.get("/motos",
    async (req, res) => {

        res.send(motos);

    });

module.exports = router;
