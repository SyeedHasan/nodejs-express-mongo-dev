
module.export = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
            // Run the next piece of function
        }
        req.flash('error_msg', 'Not authorized!');
        res.redirect('/users/login');

    } 
}