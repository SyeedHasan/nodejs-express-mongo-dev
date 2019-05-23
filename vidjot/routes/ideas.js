const express = require('express');
const router = express.Router();

// App Ideas Page
router.get('/ideas', (req, res) => {
    Idea.find({})
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
router.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//  Edit Idea Form Route
router.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => res.render('ideas/edit', {
            idea: idea
        }))
});


// Add Process Form
router.post('/ideas', (req, res) => {
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
            details: req.body.details
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
router.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then( idea => {
            // Update the idea
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video idea updated successfully!');
                    res.redirect('/ideas') });
        });
});

// Delete Request
router.delete('/ideas/:id', (req, res) => {
    Idea.remove({
        // Query: Match _id with our ID
        _id: req.params.id
    })    
        .then( () => {
            req.flash('success_msg', 'Video idea deleted successfully!');
            res.redirect('/ideas');
        })
});


module.exports = router;