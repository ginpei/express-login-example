const express = require("express");
const { resolve } = require("path");
const { urlencoded } = require("body-parser");

const port = 3000;
const staticPath = resolve(__dirname, "../public");

const app = express();
app.set("view engine", "ejs");
app.use(urlencoded({ extended: true }));
app.use(express.static(staticPath));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/login", (req, res) => {
  res.render("login/index.ejs");
});

app.post("/login", (req, res) => {
  /** @type {Partial<{
   *   userName: string;
   *   password: string;
   * }>} */
  const { userName, password } = req.body;

  if (!userName || !password) {
    res.status(400);
    res.render("error.ejs", {
      messages: ["Account and password are required"],
    });
    return;
  }

  res.status(500);
  res.json({ ok: false, message: "Not implemented" });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log("Port", port);
});
