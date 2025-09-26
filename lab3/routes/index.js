const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const path = require("path");

router.get("/", async (req, res) => {
  try {
    const todosPath = path.join(__dirname, '../todos.json')
    const todos = await fs.readFile(todosPath, "utf-8");
    const parsedTodos = JSON.parse(todos);

    res.json({items: parsedTodos, total: parsedTodos.length});
  } catch (error) {

    res.status(400).send("something went wrong");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todosPath = path.join(__dirname, '../todos.json')
    const todos = await fs.readFile(todosPath, "utf-8");
    const parsedTodos = JSON.parse(todos);
    const todo = parsedTodos.find((item) => item.id === Number(id));
    if (!todo) {
      res.status(404).send({ error: "Todo not found" });
    }
    res.status(200).send({todo: todo});
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const todosPath = path.join(__dirname, "../todos.json");
    const todos = await fs.readFile(todosPath, "utf-8");
    let parsedTodos = JSON.parse(todos);
    const todo = parsedTodos.find((todo) => {
    return todo.id === Number(id);
});

    if (todo) {
      parsedTodos = parsedTodos.filter((todo) => todo.id != Number(id));
      await fs.writeFile(todosPath, JSON.stringify(parsedTodos, null, 2));
      res.status(204).send();
    } else {
      res.status(404).send({ error: "Todo not found" });
    }
    
  } catch {
    res.send("something went wrong");
  }
});

module.exports = router;
