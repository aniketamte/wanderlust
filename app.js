if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

//for session package pupose
const session = require("express-session");

const MongoStore = require("connect-mongo");

//for flash message alert message
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const Listing = require("./models/listing.js");

//for Reviews purpuse
const Review = require("./models/review.js");
const User = require("./models/user.js");

//for listing another page arrage to acqure that
const listingRouter = require("./routes/listing.js");

//for review another page arrage to acqure that
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//for ejsMate
const ejsMate = require("ejs-mate");

//for error handling
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  // mongoUrl: dbUrl,
  mongoUrl: dbUrl,

  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in Mongo SESSION STORE", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));

app.use(flash());
//for inilization password
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

//session rahanya sati
passport.serializeUser(User.serializeUser());

//session band karyanya sati
passport.deserializeUser(User.deserializeUser());

// Middleware for flash messages and current user
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Main route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter); //line used for we transfer the listing all route to anthoer page that purpuse.

app.use("/listings/:id/reviews", reviewRouter); //same for that

app.use("/", userRouter);

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "aniketamte",
  });
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});

// Database connection
main()
  .then(() => {
    console.log("Connection successfully");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// All Route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error Handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is started");
});
