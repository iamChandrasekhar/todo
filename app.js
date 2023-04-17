const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());
let database = null;

const dbAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB ERROR: ${error.message}`);
    process.exit(1);
  }
};
dbAndServer();

app.get("/todos/", async (request, response) => {
  const { priority = "" } = request.query;
  const getQuery = `
    SELECT * FROM todo WHERE priority LIKE '${priority}';`;
  const todo_priority = await database.all(getQuery);
  response.send(todo_priority);
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.query;
  const idsQuery = `
    SELECT * FROM todo WHERE id = ${todoId};`;
  const ids = await database.all(idsQuery);
  response.send(ids);
});

app.post("/todos/", async (request, response) => {
  const todoDetails = request.params;
  const { id, todo, priority, status } = todoDetails;
  const postQuery = `
    INSERT INTO todo (id,todo,priority,status)
    VALUES (id = ${id},todo=${todo},priority = ${priority},status = ${status});`;
  const newId = await database.all(postQuery);
  response.send("Todo Successfully Added");
});

//app.put("/todos/:todoId/", async (request, response) => {});
module.exports = app;
