const express = require("express");
const session = require("express-session");
const { checkLoggedIn, bypassLogin } = require("./middleware");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "my_session_secret",
    resave: true,
    saveUninitialized: false,
    name: "733visual",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: true,
    },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.get("/", checkLoggedIn, (req, res) => {
  res.render("Home");
});

app.get("/login", bypassLogin, (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  if (req.body.username === "admin" && req.body.password === "admin") {
    // creae a session
    req.session.user = { id: 1, username: "admin", name: "Admin" };
    res.redirect("/");
  } else {
    res.render("login", { error: "Invalid username or password" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("733visual");
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
