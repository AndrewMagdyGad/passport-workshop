const express = require("express");
const User = require("../schemas/User");
const bcrypt = require("bcrypt");
const passport = require("passport");

const router = express.Router();

router.get("/register", (req, res, next) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/register", async (req, res) => {
    const body = req.body;
    const newUser = new User({ ...body });
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
            newUser.password = hash;
            const data = await newUser.save();
            res.send(data);
        });
    });
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/user/profile",
        failureRedirect: "/user/login",
    })(req, res, next);
});

const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/user/login");
    }
};

router.get("/profile", ensureAuth, (req, res) => {
    res.send("USER PROFILE");
});

module.exports = router;
