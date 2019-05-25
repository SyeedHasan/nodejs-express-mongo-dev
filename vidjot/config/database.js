if (process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 
    'mongodb+srv://Syed:hasan123@vidjotapp-s9you.mongodb.net/test?retryWrites=true'}
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}