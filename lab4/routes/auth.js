const express = require("express");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../helpers/database");

const registerSchema = joi.object({
    name: joi.string().min(2).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    age: joi.number().integer().min(13).max(120).required()
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
});

router.post("/register", async (req, res) => {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error});
    }
    const { name, email, password, age } = value;

    try {
        const user = await query("SELECT id FROM users WHERE email = ?", [email]);
        if (user.length > 0) {
            return res.status(409).json({ error: "email already used" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await query(
            "INSERT INTO users (name, email, password_hash, age) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, age]
        );
        
        res.status(201).json({ message: "successful"});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err});
    }
});

router.post("/login", async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error });
    }
    const { email, password } = value;

    try {
        const users = await query("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: "no user with this email" });
        }
        const user = users[0];

        const compare = await bcrypt.compare(password, user.password_hash);
        if (!compare) {
            return res.status(401).json({ error: "wrong password" });
        }

        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, "alisecretkey", { expiresIn: "1h" });

        res.status(200).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "something wrong" });
    }
});

module.exports = router;