const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../schemas/User");

// done(err, false)

module.exports = function (passport) {
    // 1. Implement Startegy
    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            async (email, password, done) => {
                const user = await User.findOne({ email: email });
                if (!user) {
                    done(null, false);
                } else {
                    bcrypt.compare(
                        password,
                        user.password,
                        (err, isMatched) => {
                            if (isMatched) {
                                done(null, user);
                            } else {
                                done(null, false);
                            }
                        }
                    );
                }
            }
        )
    );
    // 2. Serialize User
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 3. Deserialze User
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
};
