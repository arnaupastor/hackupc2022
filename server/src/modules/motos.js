const express = require("express");
const router = express.Router();
const {sql} = require("../db.js");

// --------------------------
// GET API
// --------------------------

router.get("/brands",
    async (req, res) => {

    const brands = await sql.any('SELECT * FROM brands LIMIT 10');

    res.send(brands);

});

module.exports = router;
