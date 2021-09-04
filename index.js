require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const userRouter = require("./routes/users");
const app = express();

require("./config/passport")(passport);

const PORT = process.env.PORT || 3000;

mongoose.connect(
    process.env.CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to db")
);

app.use(session({ secret: "secret" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set View engine to express app
app.set("view engine", "pug");
app.set("views", "./views");

app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
