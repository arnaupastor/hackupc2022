const express = require("express");
const router = express.Router();
const {sql} = require("../db.js");
const motos = require("./motos.json");
const {GOOGLE_IMG_SCRAP} = require('google-img-scrap');

// --------------------------
// Generate users
// --------------------------

router.get("/motos",
    async (req, res) => {

        let data = motos.splice(0, 10)

        res.send(data);

    });

router.get("/image/:input",
    async (req, res) => {
        const image = await scrapImage(req.params.input);
        console.log("-->", image)
        res.send(image.url);
    });

async function scrapImage(input) {
    const image = await GOOGLE_IMG_SCRAP({
        search: input,
        limit: 1,
    });

    if (image && image.result.length)
        return image.result[0]
    return ""
}


module.exports = router;
