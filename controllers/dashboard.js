const User = require('../models/user');
module.exports.index = async (req, res) => {
    const users = await User.find({});
    res.render('dashboard/index', { users });
};