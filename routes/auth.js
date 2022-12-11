const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

const generateAccessToken = (id) => {
    return jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "100000s" });
};

//register user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, cpassword } = req.body;
        //check if email exists
        if (password !== cpassword) {
            return res.status(409).json({ error: "Passowrds do not match" });
        }
        const emailCheck = "SELECT * FROM user WHERE email = ?";
        db.query(emailCheck, [email], async (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong" });
            }
            if (data.length) {
                return res.status(409).json({ error: "Email already taken" });
            }
            //create new user
            const newUser = "INSERT INTO user (`name`, `email`, `password`) VALUES (?)";
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const values = [name, email, hashedPassword];
            db.query(newUser, [values], (err, data) => {
                if (err) {
                    return res.status(500).json({ error: "Something went wrong" });
                }
                const accessToken = generateAccessToken(data.insertId);
                return res.status(201).json({
                    success: "Succesfully created account",
                    accessToken: accessToken,
                    id: data.insertId,
                });
            });
        });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" });
    }
});

// login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailCheck = "SELECT * FROM user WHERE email = ?";
        db.query(emailCheck, [email], async (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong" });
            }
            if (data.length === 0) {
                return res.status(404).json({ error: "Invalid Credentials" });
            }
            const validated = await bcrypt.compare(password, data[0].password);
            if (!validated) {
                return res.status(400).json({ error: "Invalid Credentials" });
            }
            const accessToken = generateAccessToken(data[0].id);
            res.status(200).json({
                success: "Logged in successfully",
                accessToken: accessToken,
                id: data[0].id,
            });
        });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
