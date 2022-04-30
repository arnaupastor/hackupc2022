const express = require("express");
const router = express.Router();
const users = require(`./users.json`);
const {sql} = require(`../db.js`);
const motos = require(`./motos.json`);

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
    //console.log("vectorA", vectorA);
    //console.log("vectorB", vectorB);

    const valuesA = Object.values(vectorA);
    const valuesB = Object.values(vectorB);

    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    //console.log("length", valuesA.length);
    for (let i = 0; i < valuesA.length; ++i) {

        let num1 = parseInt(valuesA[i]);
        let num2 = parseInt(valuesB[i]);

        dotProduct += num1 * num2;
        normA += Math.pow(num1, 2);
        normB += Math.pow(num2, 2);

       /* console.log("num1", num1);
        console.log("num2", num2);
        console.log("dotProduct", dotProduct);
        console.log("normA", normA);
        console.log("normB", normB);*/
    }

    if (Math.sqrt(normA) * Math.sqrt(normB) === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function nameSimilarity() {

}

function knn(motos, motoValorada) {
    //console.log("motoValorada",motoValorada);
    //let Map = require("collections/sorted-map");
    let result = new Map();
    let {brand,model,version, ...numAttrValorat} = motoValorada;
    let brandValorat = brand;
    let modelValorat = model;
    let versionValorat = version;
    let idMotoValorada = motoValorada.id;

    console.log("brand",brand);
    console.log("model",model);
    console.log("version",version);
    console.log("idMotoValorada",idMotoValorada);
    console.log("numAttrValorat",numAttrValorat);

    //console.log("numAttrValorat:", numAttrValorat);
    //console.log("nameValorat:", nameValorat);
    //console.log("idMotoValorada:", idMotoValorada);

    for (let moto of motos) {
        let {name, ...numAttr} = moto;
        let nameMoto = name;
        let {id, ...numAttrSinId} = numAttr;
        let idMoto = id;
        let sim = cosSimiliarity(numAttr,numAttrValorat);

        //console.log("numAttrSinId:", numAttrSinId);
        //console.log("nameMoto:", nameMoto);
        //console.log("idMoto:", id);
        //console.log("sim:", sim);

        result.set(idMoto, sim);
    }
    //console.log(result);
    //console.log(mapSoreted);
    return new Map([...result.entries()].sort((a, b) => b[1] - a[1]));
}


const autoConvertMapToObject = (map) => {
    const obj = {};
    for (const item of [...map]) {
        const [
            key,
            value
        ] = item;
        obj[key] = value;
    }
    return obj;
}


function getMotosById(motos, ids) {
    motosSelected = []
    //console.log("ids: " + ids);
    //console.log("motos", motos);
    for (let moto of motos) {
        //console.log(moto);
        //console.log(moto.id);
        //console.log("ids", ids);
        if (ids.includes(moto.id)) {
            motosSelected.push(moto);
        }
    }
    //console.log("motosSelected", motosSelected);
    return motosSelected;
}

router.get("/content",
    async (req, res) => {

    const user = users.find(u => u.user_id = USER_ID);
    //const motos = await sql.any(`SELECT * FROM versions`);


    //console.log(idValorats(user));
    motosValorades = getMotosById(motos, idValorats(user));
    motosClean = cleanDataset(motos, motosValorades);
    
    let k = 3;
    /*for (let moto in motosValorades) {
        //obtenid millors motos per moto valorada
        knn(motosClean, moto);
    }*/

    //console.log(motosValorades);
    //res.send(motos);

    res.send(Array.from(knn(motosClean, motosValorades[0])).slice(0,10));
});

module.exports = router;