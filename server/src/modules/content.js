const express = require("express");
const router = express.Router();
const users = require(`./users.json`);

// --------------------------
// GET API
// --------------------------

const USER_ID = 1;

router.get("/content",
    async (req, res) => {

    const user = users.find(u => u.user_id = USER_ID);

    res.send(user);

});

module.exports = router;
