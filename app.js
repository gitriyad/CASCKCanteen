// Requiring Packages
let express = require("express");
let mongoose = require("mongoose");
let app = express();
let path = require("path");
let envVariables = require("./config/env");
let session = require("express-session");
let mongodbStore = require("connect-mongodb-session")(session);
let PORT = process.env.PORT || 3000;
let rootDir = require("./utility/root");
let crypto = require("crypto");

// getting routes
let authRoutes = require("./route/auth");
let adminRoutes = require("./route/admin");

// importing middlewares
let middleware = require("./middleware/middleware");

// storing sessions in database
let store = new mongodbStore({
  uri: envVariables.connectionString,
  collection: "sessions",
});

// generate session name
let sessonName = "UT";

// Rendering middlewares

app.use(
  session({
    secret: envVariables.secretKey,
    resave: true,
    saveUninitialized: true,
    store: store,
    name: sessonName,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 2 * 365 * 24 * 60 * 60 * 1000,
    },
  })
);

// global execution and serving static files
app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "views", "view"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));

// Rendering route middleware
app.use(middleware.getUrl);

// Rendering Routes

app.use(authRoutes);
app.use(adminRoutes);
app.get("*", middleware.pageNotFound);
// Connecting to database
mongoose
  .connect(envVariables.connectionString)
  .then((res) => {
    console.log("Database Connected");
    app.listen(PORT);
  })
  .catch((databaseConnectionError) => {
    console.log(`Database Connection Error ${databaseConnectionError.message}`);
  });
