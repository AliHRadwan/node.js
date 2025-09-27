const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { query } = require("../helpers/database");

router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await query("SELECT * FROM users WHERE id = ?", [userId]);

        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const userProfile = user[0];
        
        res.status(200).json(userProfile);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error" });
    }
});

module.exports = router;