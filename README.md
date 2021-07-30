# express-login-example

## Set up server

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

Run it, and open `http://localhost:3000/` to see `{ ok: true }` in browser.

## Routing

Use `app.get()` to receive HTTP GET request, `app.post()` for POST, and such.

Use `res.json()` to return JSON string.

```js
app.get("/", (req, res) => {
  res.json({ ok: true });
});
```

## Render HTML

Express requires a view engine to render HTML. Here We're going to choose [ejs](https://github.com/tj/ejs).

```console
$ npm install ejs
```

```js
app.set("view engine", "ejs");
```

Create a template HTML with `.ejs` extension under `views/` directory. (`<project-root>/views/index.ejs`) Then use `res.render()` to render the result HTML using the template.

```js
app.get("/", (req, res) => {
  res.render("index.ejs");
});
```

Note the template file path in the first parameter is relative from `<project-root>/views/`.

## Static files

While a web server renders an HTML document dynamically, files like CSS are static (not changed).

Let's say this JS file is located under `<project-root>/public/`, and static files are under `<project-root>/public/`.

```js
const { resolve } = require("path");

const staticPath = resolve(__dirname, "../public");
app.use(express.static(staticPath));
```

Now you can access to the file `<project-root>/public/main.css` by the URL path `/main.css`.

```html
<link rel="stylesheet" href="/main.css">
```

## Receive form inputs

To receive data from client, use `body-parser`. (Because Express depends on it, you can ommit obvious installation if you want.)

```console
$ npm install body-parser
```

```js
const { urlencoded } = require("body-parser");

…

app.use(urlencoded({ extended: true }));
```

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

## Set and get cookies

To set cookie, use `res.cookie()`.

```js
res.cookie("sid", session.id);
```

To read cookie, set up cookie parser, and use `req.cookies`.

```console
$ npm install cookie-parser
```

```js
const cookieParser = require("cookie-parser");
app.use(cookieParser());
```

```js
const sessionId = req.cookies.sid;
```
