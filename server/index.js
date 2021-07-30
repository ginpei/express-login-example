const express = require("express");

const port = 3000;

const app = express();
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/login", (req, res) => {
  res.render("login/index.ejs");
});

app.post("/login", (req, res) => {
  // WIP

  console.log("# req.body", req.body);

  res.status(500);
  res.json({ ok: false, message: "Not implemented" });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log("Port", port);
});
