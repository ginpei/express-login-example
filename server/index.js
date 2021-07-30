const express = require("express");

const port = 3000;

const app = express();
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("./index.ejs");
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log("Port", port);
});
