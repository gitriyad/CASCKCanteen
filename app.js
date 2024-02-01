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

// storing sessions in database
let store = new mongodbStore({
  uri: envVariables.connectionString,
  collection: "sessions",
});

// getting routes
let authRoutes = require("./route/auth");

// global execution and serving static files
app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "views", "view"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: envVariables.secretKey,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(express.static(path.join(rootDir, "public")));

// Rendering Routes
app.use(authRoutes);
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
