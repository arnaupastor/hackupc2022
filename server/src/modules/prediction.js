const express = require("express");
const router = express.Router();
const {sql} = require("../db.js");
const motos = require("./motos.json");
const fs = require("fs");
const { exec } = require('child_process');

// --------------------------
// Generate users
// --------------------------

router.get("/prediction/:brand/:model/:version/:year/:km",
    async (req, res) => {
        const brand  = req.params.brand;
        const model  = req.params.model;
        const version  = req.params.version;
        const year  = req.params.year;
        const km  = req.params.km;

        exec(`python3 ./src/recomendationModels/main.py "${brand}" "${model}" "${version}" ${year} ${km}`, (err, stdout, stderr) => {
            if (err) {
                //some err occurred
                console.error(err)
            } else {
                // the *entire* stdout and stderr (buffered)
                console.log(`stdout: ${stdout}`);
                res.send(stdout);
            }
        });

    });

router.get("/brands",
    async (req, res) => {

        const brands = await sql.any(`SELECT * FROM brands`)

        res.send(brands)
    });



// main()

module.exports = router;
