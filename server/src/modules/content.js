const express = require("express");
const router = express.Router();
const users = require(`./users.json`);
const {sql} = require(`../db.js`)

// --------------------------
// GET API
// --------------------------

const USER_ID = 1;

function idValorats(user) {
    let ids = [];
    for (let i = 0; i < length(user); ++i) {
        ids.push(user[i].moto_id);
    }

    return ids;
}

function cleanDataset(motos, motosValorades) {
    let motosClean = [];
    for (let i = 0; i < length(motos); ++i) {
        if (!motosValorades.includes(parseInt(motos[i].id))) {
            motosClean.push(motos[i]);
        }
    }

    return motosClean;
}

function cosSimiliarity() {

}

function nameSimilarity() {

}

function knn(motos, id) {

}

router.get("/content",
    async (req, res) => {

    const user = users.find(u => u.user_id = USER_ID);
    const motos = await sql.any(`SELECT * FROM versions LIMIT 10`);

    motosValorades = idValorats(user);
    motosClean = cleanDataset(motos, motosValorades);
    
    let k = 3;
    for (let i = 0; i < this.length(user); ++i) {
        
    }

    console.log("Content!");
    res.send(motos);
    //res.send(user);

});

module.exports = router;
