const express = require("express");
const router = express.Router();
const {sql} = require(`../db.js`);
const motos = require(`./motos.json`);
var fs = require('fs');

// --------------------------
// GET API
// --------------------------

const USER_ID = 1;

function idValorats(user) {
    let ids = [];
    for (let i = 0; i < user.visits.length; ++i) {
        ids.push(user.visits[i].moto_id);
    }

    return ids;
}

function cleanDataset(motos, motosValorades) {
    let motosClean = [];

    for (let i = 0; i < motos.length; ++i) {
        if (!motosValorades.includes(motos[i])) {
            motosClean.push(motos[i]);
        }
    }

    return motosClean;
}

function cosSimiliarity(vectorA, vectorB) {
    const valuesA = Object.values(vectorA);
    const valuesB = Object.values(vectorB);

    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;

    for (let i = 0; i < valuesA.length; ++i) {
        let num1 = parseInt(valuesA[i]);
        let num2 = parseInt(valuesB[i]);

        dotProduct += num1 * num2;
        normA += Math.pow(num1, 2);
        normB += Math.pow(num2, 2);
    }

    if (Math.sqrt(normA) * Math.sqrt(normB) === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function nameSimilarity(vectorA, vectorB) {
    let intersection = 0;
    for (let item1 of vectorA) {
        if (vectorB.includes(item1)) ++intersection;
    }

    let union = vectorA.length;

    if (union === 0) return 0;

    return intersection / union;
}

function knn(motos, motoValorada) {
    let result = new Map();

    let {id, brand, model, version, ...numAttrValorat} = motoValorada;

    let categoricalAttrValorat = [];
    categoricalAttrValorat.push(brand);
    categoricalAttrValorat.push(model);
    categoricalAttrValorat.push(version);

    let idValorat = id;

    for (let moto of motos) {

        let {id, brand, model, version, ...numAttr} = moto;

        let categoricalAttr = [];
        categoricalAttr.push(brand);
        categoricalAttr.push(model);
        categoricalAttr.push(version);

        let idMoto = id;

        let sim = cosSimiliarity(numAttr, numAttrValorat);
        let cate = nameSimilarity(categoricalAttrValorat, categoricalAttr);

        let simFinal = sim * 0.4 + cate * 0.6;
        result.set(idMoto, simFinal);
    }

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

    for (let moto of motos) {
        if (ids.includes(moto.id)) {
            motosSelected.push(moto);
        }
    }
    return motosSelected;
}

function getMotosByUniqueId(motos, id) {
    motosSelected = []

    for (let moto of motos) {
         if (id == moto.id) {
            motosSelected.push(moto);
        }
    }
    return motosSelected;
}


router.get("/content",
    async (req, res) => {

        const users = await sql.any(`SELECT *
                                     FROM visits
                                     WHERE user_id = 1
        `)

        const user = {
            "user_id": 1,
            "visits": users.map(u => {
                return {
                    moto_id: u.moto_id,
                    visits: u.visits
                }
            })
        }

        motosValorades = getMotosById(motos, idValorats(user));
        motosClean = cleanDataset(motos, motosValorades);

        function numvisits(id_moto) {
            for (let moto of user.visits) {
                if (moto.moto_id === id_moto) return moto.visits;
            }

            return -1;
        }

        let k = 10;

        let result = [];
        for (let moto of motosValorades) {
            let aux = Array.from(knn(motosClean, moto)).slice(0, k - 1);
            aux = aux.map(m => [m[0], m[1] * numvisits(moto.id)]);
            if (aux && aux.length)
                result.push(aux);
        }

        const finalResult = [];
        result.forEach(r => {
            const info = getMotoInfo(r[0]);
            info.prob = r[1];
            if (info) finalResult.push(info);
        })

        res.send(finalResult);
    });


router.get("/content/:id",
    async (req, res) => {

        const id = req.params.id;
        motosValorades = getMotosByUniqueId(motos, id);
        motosClean = cleanDataset(motos, motosValorades);

        let k = 10;
        let result = Array.from(knn(motosClean, moto)).slice(0, k - 1);

        result = result.sort((a, b) => b[1] - a[1]);
        console.log(result)
        result = result.slice(0, k - 1);


        const finalResult = [];
        if (result.length)
            result[0].forEach(r => {
                const info = getMotoInfo(r[0]);
                if (info) finalResult.push(info);
            })

        res.send(finalResult);
    });

function getMotoInfo(moto_id) {
    return motos.find(m => {
        return m.id === moto_id
    });

}

module.exports = router;
