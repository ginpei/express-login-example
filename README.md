# express-login-example

## Try final work

```console
$ npm ci
$ npm start
```

Press `Ctrl+C` to stop.

## Tutorial 1. preparation

### Set up server

```console
$ npm install express
```

```js
const express = require("express");

const port = 3000;

const app = express();

app.get("/", (req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log("Port", port);
});
```

Run it, and open `http://localhost:3000/` to see `{ ok: true }` in a browser. (It's not HTML yet.)

### Routing

Use `app.get()` to receive HTTP GET request, `app.post()` for POST, and such.

Use `res.json()` to return JSON string.

```js
app.get("/", (req, res) => {
  res.json({ ok: true });
});
```

### Render HTML

Express requires a view engine to render HTML. Here we're going to choose one named [ejs](https://github.com/tj/ejs).

```console
$ npm install ejs
```

```js
app.set("view engine", "ejs");
```

Create a template HTML with `.ejs` extension under `views/` directory (`<project-root>/views/index.ejs`). Then use `res.render()` to render the result HTML using the template.

```js
app.get("/", (req, res) => {
  res.render("index.ejs");
});
```

Note the template file path in the first parameter is relative to `<project-root>/views/`.

Give dynamic values to ejs as the second parameter of `app.render()`, and write `<%= xxx %>` to let the template print the value.

```js
res.render("index.ejs", { message: "Hello World!" });
```

```html
<h1><%= message %></h1>
```

### Static files

While a web server renders an HTML document dynamically, files like CSS are static (not changed).

To let express server publish those files, give `express.static()` to `app.use()`. Let's say this server `index.js` file is located under `<project-root>/server/`, and static files are under `<project-root>/public/`.

```js
const { resolve } = require("path");

…

const staticPath = resolve(__dirname, "../public");
app.use(express.static(staticPath));
```

You can now access the file `<project-root>/public/main.css` by the URL path `/main.css`.

```html
<link rel="stylesheet" href="/main.css">
```

## Tutorial 2. login and session

You can manage user session by using cookie.

### Receive form inputs

To receive data from the client-side, use `body-parser` middleware. (You can omit explicit installation if you want because express has the middleware on its own dependencies.)

```console
$ npm install body-parser
```

```js
const { urlencoded } = require("body-parser");

…

app.use(urlencoded({ extended: true }));
```

Now you can get sent values over `req.body`.

```html
<form action="/postMessage" method="POST">
  <input name="message" value="hello">
  <button>Send</button>
</form>
```

```js
app.post("/postMessage", (req, res) => {
  /** @type {Partial<{
   *   message: string;
   * }>} */
  const { message } = req.body;

  res.json({ ok: true, message: `Received: ${message}` });
});
```

### Set and get cookies

To manage HTTP [cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), use `cookie-parser` middleware.

```console
$ npm install cookie-parser
```

```js
const cookieParser = require("cookie-parser");
app.use(cookieParser());
```

To write cookie, use `res.cookie()`.

```js
res.cookie("sid", session.id);
```

To read the cookie, use `req.cookies`.

```js
const sessionId = req.cookies.sid;
```

If you want to see, delete, manage cookies on your browser, open a web browser's DevTools (most likely `Ctrl+Shift+I`), and navigate yourself to > Application > Storage > Cookies.

### Log in and manage session

(Let's say you have `createSession()` and `getSession()` somehow somewhere.)

When user logged in, create a session on server, and remember its ID on cookie.

```js
// create a session between the server and the browser
const session = createSession();

// let browser remember session ID
res.cookie("sid", session.id);
```

User's browser holds session ID on the cookie. The server receives those cookie values when user made a request.

```js
// retrieve session by ID saved on cookie
const sessionId = req.cookies.sid;
const session = getSession(sessionId);
```

A session should have user information so that you can print a page for the specific user who logged in.

```js
const user = getUser(session.userId);
res.render("page.ejs", { userName: user.name });
```

```html
<h1>Hi <%= userName %>!</h1>
```

## And more...

- Cookies can have some options like expiration
- Routing code can be extracted into files
- It would be better to show the login page again if failed
- You may want to use [express-session](https://expressjs.com/en/resources/middleware/session.html) middleware
- Please try to learn but never use your own login mechanism. It must be insecure

Find more on the web. Enjoy!
