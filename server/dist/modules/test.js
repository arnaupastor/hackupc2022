var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const router = express.Router();
const { asynqQuery } = require("./utils/asyncQuery");
const { db } = require("../app");
const { auth } = require("./users");
// --------------------------
// GET API
// --------------------------
router.get("/comments", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const comments = yield asynqQuery(`SELECT * FROM comments`);
    res.send(comments);
}));
// --------------------------
// POST API
// --------------------------
router.post("/", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const text = req.body.text;
    const user_id = req.body.user_id;
    const query = `INSERT INTO comments SET ?`;
    const params = {
        user_id,
        text,
    };
    db.query(query, params, (err, result) => {
        if (err) {
            console.log(err);
            res.status(401).send({ message: "No s'ha pogut enviar el comentari." });
        }
        else {
            res.send({});
        }
    });
}));
module.exports = router;
//# sourceMappingURL=test.js.map