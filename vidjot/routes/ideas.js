const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

// Load Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');


// Remove the base route /ideas. It'll be set by default

// App Ideas Page
// Boots out when not authenticated
router.get('/', ensureAuthenticated, (req, res) => {
    // Search ideas from logged in user only
    Idea.find({
            user: req.user.id
        })
        .sort({
            date: 'desc'
        })
        .then(ideas => {
            res.render('ideas/index', {
                    ideas: ideas
                })
                .catch(err => console.log(err))
        });
});

// Idea Form Route
// Now it ensures authentication - added later
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

//  Edit Idea Form Route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            if (idea.user != req.user.id) {
                req.flash('error_msg', 'You are not authorized');
                req.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                    idea: idea
                })
            }

        })
});


// Add Process Form
router.post('', ensureAuthenticated, (req, res) => {
    // Values from the form
    // console.log(req.body);

    let errors = [];

    // Object with our form fields
    if (!req.body.title) {
        errors.push({
            text: 'Please add a title!'
        });
    }

    if (!req.body.details) {
        errors.push({
            text: 'Please add the details!'
        });
    }

    if (errors.length > 0) {
        // Reload the page; Don't remove old data
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    // No errors - Push in the database
    else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        // Mongoose model
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video idea added successfully!');
                res.redirect('/ideas');
            })
    }

});

// Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            // Update the idea
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video idea updated successfully!');
                    res.redirect('/ideas')
                });
        });
});

// Delete Request
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({
            // Query: Match _id with our ID
            _id: req.params.id
        })
        .then(() => {
            req.flash('success_msg', 'Video idea deleted successfully!');
            res.redirect('/ideas');
        })
});


module.exports = router;