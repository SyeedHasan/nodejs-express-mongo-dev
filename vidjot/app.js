const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

// Initialize our application
const app = express();

// Connect to Mongoose
    // Pass in the database from local or remote db
    // Pass in an object
mongoose.connect('mongodb://localhost/vidjot-dev', {
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB Connected... '))
    .catch((error) => console.log('ERROR: ' + error));

// Load Idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body-parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Method-override Middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

// Connect-flash middleware;
app.use(flash());

// GLOBAL VARIABLES
// Available locally everywhere
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next(); 
    // call next middleware
});



// Routing - Index Route - Use HTTP methods
app.get('/', (req, res) => {
    const title = 'Syed';
    res.render('index', {
        title: title
    });
});

// About Route
app.get('/about', (req, res) => {
    res.render('about');
});


// User login route
app.get('/users/login', (req, res) => {

});

// User register route
app.get('/users/register', (req, res) => {
    
});


// CONSTANTS
const PORT = 5000;

// Listen on a port
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});