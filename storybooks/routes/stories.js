const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated,
    ensureGuest
} = require('../helpers/auth');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

// Stories Index
router.get('/', (req, res) => {
    Story.find({
            status: 'public'
        })
        // Fill the user too, so we have access
        .populate('user')
        .sort({date:'desc'})
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        })
});

// List stories from a user
router.get('/user/:userId', ensureAuthenticated, (req, res) => {
    Story.find({user: req.params.userId, status:'public'})
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});

// Loggged in user story
router.get('/my', (req, res) => {
    Story.find({user: req.user.id})
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});


// Show Single Story
router.get('/show/:id', (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .populate('user')
        .populate('comments.commentUser')
        .then(story => {
            if(story.status == 'public'){
                res.render('index/show', {story: story})
            }
            else {
                if(req.user){
                    if(req.user.id == story.user._id) {
                        res.render('index/show', {story: story})
                    }
                    else {
                        res.redirect('/stories');
                    }
                }
                else {
                    res.redirect('/stories');
                }
            }
        });
});

// Add Story
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Edit Form Process
router.put('/:id', (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .then(story => {
            let allowComments;

            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = false;
            }

            // New values
            story.tite = req.body.title;
            story.body = req.body.body;
            story.status = req.body.status;
            story.allowComments = req.body.allowComments;

            story.save()
                .then(story => {
                    res.redirect('/dashboard');
                })


        });


});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .populate('user')
        .then(story => {
            if(story.user != req.user.id) {
                res.redirect('/stories');
            }
            res.render('stories/edit');
        });
});


// Process Add Story
router.post('/', (req, res) => {
    let allowComments;

    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }

    // Create Story
    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`);
        });
});

// Add comment
router.post('/comment/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .then(story => {
            const newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }

            // Add to comments array
            story.comments.unshift(newComment);

            story.save()
                .then(story => {
                    res.redirect(`/stories/show${story.id}`)
                })
        });
});

// Delete stories
router.delete('/:id', (req, res) => {
    Story.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/dashboard');
        })
});

module.exports = router;