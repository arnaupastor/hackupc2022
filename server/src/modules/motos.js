const express = require("express");
const router = express.Router();
const {sql} = require("../db.js");
const motos = require("./motos.json");
const {GOOGLE_IMG_SCRAP} = require('google-img-scrap');
const fs = require("fs");

// --------------------------
// Generate users
// --------------------------

router.get("/motos",
    async (req, res) => {

        let data = await sql.any(`SELECT *
                                  FROM visits
                                  WHERE user_id = 1
                                  ORDER BY visits DESC
        `)

        const resultArr = [];
        for await (let d of data) {
            const moto = motos.find(m => {
                return m.id === d.moto_id
            });
            if (moto)
                resultArr.push({...moto, visits: d.visits})
        }

        res.send(resultArr);
    });


router.get("/image/:input",
    async (req, res) => {
        const image = await scrapImage(req.params.input);
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


function main() {
    const obj = {};
    motos.forEach(m => {
        const {id, ...other} = m;
        obj[m.id] = other;
    })


    fs.writeFile("motosHash.json", JSON.stringify(obj), function (err) {
        if (err) {
            console.log(err);
        }
    });
}


// main()

module.exports = router;
