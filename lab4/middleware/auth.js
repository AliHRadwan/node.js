const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const auth = req.headers["authorization"];

    if (!auth) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = auth.split(" ")?.[1];

    try {
        const decoded = jwt.verify(token, "alisecretkey");
        
        req.user = decoded;
        
        next();

    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};

module.exports = authMiddleware;