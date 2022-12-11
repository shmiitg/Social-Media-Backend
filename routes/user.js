const express = require("express");
const router = express.Router();
const db = require("../config/db");

const authenticateToken = require("../middleware/verifyJWT");

router.get("/info", authenticateToken, (req, res) => {
    try {
        const id = req.user.id;
        const findUser = "SELECT * FROM user WHERE id = ?";
        db.query(findUser, [id], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong" });
            }
            const { password, ...user } = data[0];
            res.status(200).json({ user: user });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
