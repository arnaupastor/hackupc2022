const express = require("express");
const router = express.Router();
const {sql} = require("../db.js");
const motos = require("./motos.json")

// --------------------------
// Generate users
// --------------------------

const ids_motos = []

for (let moto of motos) {
    ids_motos.push(moto.moto_id);
}

router.get("/generate-users",
    async (req, res) => {

        // const brands = await sql.any('SELECT * FROM brands LIMIT 10');

        // users example
        //  [
        //      {
        //          user_id: 1,
        //          visits: [
        //              {
        //                  moto_id: 3,
        //                  visits: 10
        //              },
        //              ...
        //          ]
        //      },
        //      {
        //
        //      }
        //  ]

        


        let users = [];
        for (let i = 0; i < 5000; i++) {
            await sql.any(`INSERT INTO users (user_id, user_name)
                                            VALUES (${i+1}, 'user${i+1}')`)

            let visits = [];
            let n_motos_visited = (Math.random() * 10) + 20;
            for (let j = 0; j < n_motos_visited; j++) {
                
                let index = Math.floor(Math.random() * ids_motos.length);
                const id_moto = ids_motos[index];
                
                if (visits.findIndex(v => v.moto_id === moto_id) === -1) {
                    visits.push({
                        moto_id: id_moto,
                        visits: Math.floor((Math.random() * 9) + 1)
                    })

                    const visitsVal = Math.floor((Math.random() * 9) + 1);
                    await sql.any(`INSERT INTO visits (moto_id, visits, user_id)
                                            VALUES (${id_moto}, ${visitsVal}, ${i+1})`)


                }
            }
            users.push({
                user_id: i + 1,
                visits: visits
            })
        }

        res.send("Done");

    });

module.exports = router;
