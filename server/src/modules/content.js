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

    //console.log("motosValorades",motosValorades);
    for (let i = 0; i < motos.length; ++i) {
        if (!motosValorades.includes(motos[i])) {
            motosClean.push(motos[i]);
        }
    }

    //console.log("size motos",motos.length);
    //console.log("size motos clean",motosClean.length);

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

function nameSimilarity(vectorA, vectorB) {
    //console.log("vectorA",vectorA);
    //console.log("vectorB",vectorB);

    let intersection = 0;
    for (let item1 of vectorA) {
        if (vectorB.includes(item1)) ++intersection;
    }

    let union = vectorA.length;

    /*if (intersection > 0) {
        console.log("vectorA",vectorA);
        console.log("vectorB",vectorB);

        console.log("interseccio",intersection);
    }*/

    if (union === 0) return 0;

    return intersection / union;
}

function knn(motos, motoValorada) {
    //console.log("motoValorada",motoValorada);
    //let Map = require("collections/sorted-map");
    let result = new Map();

    let {id, brand, model, version, ...numAttrValorat} = motoValorada;

    let categoricalAttrValorat = [];
    categoricalAttrValorat.push(brand);
    categoricalAttrValorat.push(model);
    categoricalAttrValorat.push(version);

    let idValorat = id;
    //let brandValorat = brand;
    //let modelValorat = model;
    //let versionValorat = version;

    //console.log("idvalorat:",idValorat);
    //console.log("brand",brand);
    //console.log("model",model);
    //console.log("version",version);
    //console.log("numAttrValorat",numAttrValorat);

    //console.log("numAttrValorat:", numAttrValorat);
    //console.log("nameValorat:", nameValorat);
    //console.log("idMotoValorada:", idMotoValorada);

    for (let moto of motos) {

        let {id, brand, model, version, ...numAttr} = moto;

        let categoricalAttr = [];
        categoricalAttr.push(brand);
        categoricalAttr.push(model);
        categoricalAttr.push(version);

        let idMoto = id;
        //let brandMoto = brand;
        //let modelMoto = model;
        //let versionMoto = version;


        let sim = cosSimiliarity(numAttr, numAttrValorat);
        let cate = nameSimilarity(categoricalAttrValorat, categoricalAttr);

        //console.log("moto referencia", idValorat);
        //console.log("moto comparada", idMoto);
        //console.log("sim", sim);
        //console.log("cate", cate);

        //console.log("numAttrSinId:", numAttrSinId);
        //console.log("nameMoto:", nameMoto);
        //console.log("idMoto:", id);
        //console.log("sim:", sim);

        let simFinal = sim * 0.4 + cate * 0.6;
        result.set(idMoto, simFinal);
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
        //console.log("moto.id",moto.id);
        //console.log("ids", ids);

        if (ids.includes(moto.id)) {
            //console.log("coincidencia",moto.id);
            motosSelected.push(moto);
        }
    }
    //console.log("motosSelected", motosSelected);
    return motosSelected;
}

function getMotosByUniqueId(motos, id) {
    motosSelected = []
    //console.log("ids: " + ids);
    //console.log("motos", motos);
    for (let moto of motos) {
        //console.log(moto);
        //console.log("moto.id",moto.id);
        //console.log("ids", ids);

        if (id == moto.id) {
            //console.log("coincidencia",moto.id);
            motosSelected.push(moto);
        }
    }
    //console.log("motosSelected", motosSelected);
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


        // const user = users.find(u => u.user_id = USER_ID);
        //const motos = await sql.any(`SELECT * FROM versions`);


        //console.log(idValorats(user));
        motosValorades = getMotosById(motos, idValorats(user));
        motosClean = cleanDataset(motos, motosValorades);

        function numvisits(id_moto) {
            //console.log("id_moto",id_moto);
            for (let moto of user.visits) {
                //console.log("moto comparasion",moto.moto_id);
                if (moto.moto_id === id_moto) return moto.visits;
            }

            return -1;
        }

        let k = 10;
        let result = Array.from(knn(motosClean, moto)).slice(0, k - 1);

        result = result.sort((a, b) => b[1] - a[1]);
        console.log(result)
        result = result.slice(0, k - 1);


        //console.log(motosValorades);
        //res.send(motos);

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


        // const user = users.find(u => u.user_id = USER_ID);
        //const motos = await sql.any(`SELECT * FROM versions`);


        //console.log(idValorats(user));
        //motosValorades = getMotosById(motos, idValorats(user));

        const id = req.params.id;
        motosValorades = getMotosByUniqueId(motos, id);

        motosClean = cleanDataset(motos, motosValorades);

        function numvisits(id_moto) {
            //console.log("id_moto",id_moto);
            for (let moto of user.visits) {
                //console.log("moto comparasion",moto.moto_id);
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

        result = result.sort((a, b) => b[1] - a[1]);
        console.log(result)
        result = result.slice(0, k - 1);


        //console.log(motosValorades);
        //res.send(motos);

        const finalResult = [];
        result.forEach(r => {
            const info = getMotoInfo(r[0]);
            info.prob = r[1];
            if (info) finalResult.push(info);
        })

        res.send(finalResult);
    });

function getMotoInfo(moto_id) {
    return motos.find(m => {
        return m.id === moto_id
    });

}

function main() {
    const result = motos.map(m => {
        if (m.id && m.brand && m.model && m.version && m.year && m.km && m.sell_price) {
            return {
                id: m.id,
                brand: m.brand,
                model: m.model,
                version: m.version.toString(),
                year: m.year,
                km: m.km,
                sell_price: m.sell_price
            }
        }


    }).filter(m => m);


    fs.writeFile("./src/modules/motomami.json", JSON.stringify(result), function (err) {
        if (err) {
            console.log(err);
        }
    });
}


// main()

module.exports = router;
