const express = require("express");
const router = express.Router();
const {sql} = require("../db.js");
const motos = require("./motos.json");
const Scraper = require('images-scraper');

// --------------------------
// Generate users
// --------------------------

router.get("/motos",
    async (req, res) => {

        const google = new Scraper({
            puppeteer: {
                headless: false,
            },
        });

        const results = await google.scrape('banana', 200);
        console.log('results', results);

        res.send(results);

    });

module.exports = router;
