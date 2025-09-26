const express = require("express");
const Router = require('./routes/index')
const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  res.send("Welcome to Homepage");
});

app.use("/api/todos", Router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});