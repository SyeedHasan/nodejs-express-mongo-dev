
const express = require('express');
const exphbs  = require('express-handlebars');

// Initialize our application
const app = express();

// Handlebars Middleware 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

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

// CONSTANTS
const PORT = 5000;

// Listen on a port
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
