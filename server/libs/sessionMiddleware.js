const session = require("express-session");
const sessionStore = require("./mongoStore");
const secret = process.env.SESSION_SECRET;

const sessionMiddleware = session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
    store: sessionStore,
  });
module.exports = sessionMiddleware;