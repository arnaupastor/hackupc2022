const {sql} = require("../db.js");
const motos = require("../modules/motos.json");
const {GOOGLE_IMG_SCRAP} = require('google-img-scrap');


async function getMotoInfo(moto_id) {
    const moto = motos.find(m => {
        if (moto_id === 24)
        console.log(m.id, moto_id)
        return m.id === moto_id
    });
    if (moto) {
        const res = await scrapImage(`${moto.brand} ${moto.model} ${moto.version}`);
        return res.url;
    }
    return null;
}

async function scrapImage(input) {
    const image = await GOOGLE_IMG_SCRAP({
        search: input,
        limit: 1,
        // domains: ["alamy.com", "istockphoto.com", "vecteezy.com"],
        // excludeDomains: ["istockphoto.com", "alamy.com"]

    });

    if (image && image.result.length)
        return image.result[0]
    return ""
}


module.exports.getMotoInfo = getMotoInfo;
