const express = require("express");
const router = express.Router();
const users = require(`./users.json`);
const {sql} = require(`../db.js`)

// --------------------------
// GET API
// --------------------------

const USER_ID = 1;

function idValorats(user) {
    //console.log("user", user)
    let ids = [];
    for (let i = 0; i < user.visits.length; ++i) {
        ids.push(user.visits[i].moto_id);
    }

    //console.log("ids", ids)
    return ids;
}

function cleanDataset(motos, motosValorades) {
    let motosClean = [];
    for (let i = 0; i < motos.length; ++i) {
        if (!motosValorades.includes(parseInt(motos[i].id))) {
            motosClean.push(motos[i]);
        }
    }

    return motosClean;
}

function cosSimiliarity(vectorA, vectorB) {
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;

    for (let i = 0; i < normA.length; ++i) {
        let num1 = parseInt(vectorA[i]);
        let num2 = parseInt(vectorB[i]);

        dotProduct += num1 * num2;
        normA += Math.pow(num1, 2);
        normB += Math.pow(num2, 2);
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function nameSimilarity() {

}

function knn(motos, motoValorada) {
    console.log("motoValorada",motoValorada);
    let sortedMap = require("collections/sorted-map");
    let result = sortedMap();
    let {name, ...numAttrValorat} = motoValorada;
    let nameValorat = name;
    let idMotoValorada = motoValorada.id;

    console.log("numAttrValorat:", numAttrValorat);
    console.log("nameValorat:", nameValorat);
    console.log("idMotoValorada:", idMotoValorada);

    for (let moto of motos) {
        let {name, ...numAttr} = moto;
        let nameMoto = name;
        let {id, ...numAttrSinId} = numAttr;
        let idMoto = id;
        let sim = cosSimiliarity(numAttr,numAttrValorat);

        console.log("numAttrSinId:", numAttrSinId);
        console.log("nameMoto:", nameMoto);
        console.log("idMoto:", id);
        console.log("sim:", sim);

        result.set(idMoto, sim);
    }

    return result;
}

function getMotosById(motos, ids) {
    motosSelected = []
    //console.log("ids: " + ids);
    //console.log("motos", motos);
    for (let moto of motos) {
        //console.log(moto.id);
        //console.log("ids", ids);
        if (ids.includes(parseInt(moto.id))) {
            motosSelected.push(moto);
        }
    }
    //console.log("motosSelected", motosSelected);
    return motosSelected;
}

router.get("/content",
    async (req, res) => {

    const user = users.find(u => u.user_id = USER_ID);
    const motos = await sql.any(`SELECT * FROM versions`);

    //console.log(idValorats(user));
    motosValorades = getMotosById(motos, idValorats(user));
    motosClean = cleanDataset(motos, motosValorades);
    
    let k = 3;
    /*for (let moto in motosValorades) {
        //obtenid millors motos per moto valorada
        knn(motosClean, moto);
    }*/

    //console.log(motosValorades);
    //res.send(motosValorades);
    res.send(knn(motosClean, motosValorades[0]));
    //res.send(motos);
    //res.send(user);

});

module.exports = router;
