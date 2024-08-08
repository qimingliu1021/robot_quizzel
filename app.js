const express = require("express");
const bodyParser = require("body-parser");
const quizRoutes = require("./src/routes/quizRoutes");

const app = express();

app.use(bodyParser.json());
app.use("/api", quizRoutes);

app.use((req, res, next) => {
  res.status(404).send("Sorry, that route does not exist.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
