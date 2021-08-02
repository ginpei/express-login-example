const express = require("express");
const { resolve } = require("path");
const { urlencoded } = require("body-parser");
const {
  certifyByPassword,
  createSession,
  getSession,
  getUser,
  getUserByUserName,
  saveSession,
  deleteSession,
  getRandomUserCredential,
} = require("./fake");

// static values
const port = 3000;
const staticPath = resolve(__dirname, "../public");

// set up express with middleware
const app = express();
app.set("view engine", "ejs");
app.use(urlencoded({ extended: true }));
app.use(express.static(staticPath));

// ----------------------------------------------------------------
// routings and controllers

app.get("/", (req, res) => {
  const loginUser = getLoginUser(req);

  res.render("index.ejs", { loginUser });
});

app.get("/login", (req, res) => {
  const { userName, password } = getRandomUserCredential();
  res.render("login/index.ejs", { userName, password });
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
  const correct = user && certifyByPassword(user.id, password);
  if (!user || !correct) {
    res.status(401);
    res.render("error.ejs", {
      messages: ["Pair of user name and password are not correctj"],
    });
    return;
  }

  const session = createSession(user.id);
  saveSession(session);

  setSessionId(res, session.id);
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
    setSessionId(res, "");
  }

  res.redirect("/");
});

// ----------------------------------------------------------------

// get started!
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log("Port", port);
});

// ----------------------------------------------------------------
// misc

/**
 * @param {import("express").Request} req
 */
function getLoginUser(req) {
  const sessionId = getSessionId(req);

  const session = getSession(sessionId);
  if (!session || !session.userId) {
    return null;
  }

  const user = getUser(session.userId);
  return user;
}

/**
 * @param {import("express").Request} req
 */
function getSessionId(req) {
  const sessionId = req.headers.cookie
    ?.split("; ")
    .find((v) => v.startsWith("sid="))
    ?.slice("sid=".length);
  if (!(typeof sessionId === "string")) {
    return "";
  }

  return sessionId;
}

/**
 * @param {import("express").Response} res
 * @param {string} sessionId
 */
function setSessionId(res, sessionId) {
  res.setHeader("Set-Cookie", `sid=${sessionId}`);
}
