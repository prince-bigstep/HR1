const Request = require('./models/request');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAdmin = async(req, res, next) => {
    if (!req.designation === 'Admin') {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/dashboard');
    }
    next()
}

module.exports.isManager = async(req, res, next) => {
    if (!req.user.mentees.length) {
        req.flash('error', 'You do not have any mentees under you yet!');
        return res.redirect('/dashboard');
    }
    next()
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const request = await Request.findById(id);
    if (!request.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/dashboard`)
    }
    next()
}

