const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
require('../models/User');
const User = mongoose.model('users');

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
        // Check for the user and match
        User.findOne({
                email: email
            })
            .then(user => {
                // IF no user is found, return the error
                if (!user) {
                    // takes error and the user and msg
                    return done(null, false, {
                        message: 'No such user found!'
                    });
                }

                // Otherwise, match the user
                // Unhash the password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        // It went succcessfully!
                        // No error and the user
                        return done(null, user);
                    } else {
                        // didn't match but the user exists
                        return done(null, false, {
                            message: 'Password incorrect!'
                        });
                    }
                })


            })
    }));

    // Session control.
    // Don't ask for the credentials again and again
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}