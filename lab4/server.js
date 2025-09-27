const express = require("express");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ "message": "Welcome to the API" });
});

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});