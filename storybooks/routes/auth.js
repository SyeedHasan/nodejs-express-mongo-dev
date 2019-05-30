const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    // If successful, redirect to home.
    (req, res) => {
        res.redirect('/dashboard');
    }
);

router.get('/verify', (req, res) => {
    if(req.user) {
        res.send("HI!");
    }
    else {
        res.send("Hi!");
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');

});

module.exports = router;