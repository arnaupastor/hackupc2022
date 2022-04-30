const express = require("express");
const router = express.Router();
const users = require(`./users.json`);

// --------------------------
// GET API
// --------------------------

router.get("/collaborative",
    async (req, res) => {

    res.send(users);

});

module.exports = router;
