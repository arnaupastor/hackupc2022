const express = require("express");
const router = express.Router();
const {sql} = require("../db.js");

// --------------------------
// Generate users
// --------------------------

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
        for (let i = 0; i < 100; i++) {
            await sql.any(`INSERT INTO users (user_id, user_name)
                                            VALUES (${i+1}, 'user${i+1}')`)

            let visits = [];
            let n_motos_visited = (Math.random() * 7) + 3;
            for (let j = 0; j < n_motos_visited; j++) {
                const moto_id = Math.floor(Math.random() * 4256 + 1);
                if (visits.findIndex(v => v.moto_id === moto_id) === -1) {
                    visits.push({
                        moto_id: moto_id,
                        visits: Math.floor((Math.random() * 9) + 1)
                    })

                    const visitsVal = Math.floor((Math.random() * 9) + 1);
                    await sql.any(`INSERT INTO visits (moto_id, visits, user_id)
                                            VALUES (${moto_id}, ${visitsVal}, ${i+1})`)


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
