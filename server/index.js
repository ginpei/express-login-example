const express = require("express");
const { resolve } = require("path");
const { urlencoded } = require("body-parser");
const cookieParser = require("cookie-parser");
const {
  certifyByPassword,
  createSession,
  getSession,
  getUser,
  getUserByUserName,
  saveSession,
  deleteSession,
} = require("./fake");

const port = 3000;
const staticPath = resolve(__dirname, "../public");

const app = express();
app.set("view engine", "ejs");
app.use(urlencoded({ extended: true }));
app.use(express.static(staticPath));
app.use(cookieParser());

app.get("/", (req, res) => {
  const loginUser = getLoginUser(req);

  res.render("index.ejs", { loginUser });
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
      messages: ["User name and password are required"],
    });
    return;
  }

  const user = getUserByUserName(userName);
  const correct = certifyByPassword(user.id, password);
  if (!correct) {
    res.status(401);
    res.render("error.ejs", {
      messages: ["Pair of user name and password are not correctj"],
    });
    return;
  }

  const session = createSession(user.id);
  saveSession(session);

  res.cookie("sid", session.id);
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  const loginUser = getLoginUser(req);

  res.render("logout/index.ejs", { loginUser });
});

app.post("/logout", (req, res) => {
  const sessionId = getSessionId(req);
  if (sessionId) {
    deleteSession(sessionId);
    res.cookie("sid", null);
  }

  res.redirect("/");
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log("Port", port);
});

/**
 * @param {import("express").Request} req
 */
function getLoginUser(req) {
  const sessionId = getSessionId(req);

  const session = getSession(sessionId);
  if (!session) {
    return null;
  }

  const user = getUser(session.userId);
  return user;
}

/**
 * @param {import("express").Request} req
 */
function getSessionId(req) {
  const sessionId = req.cookies.sid;
  if (!(typeof sessionId === "string")) {
    return "";
  }

  return sessionId;
}
