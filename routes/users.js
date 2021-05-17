const express = require('express');
const router = express.Router();
const users = require('../controllers/users')
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, isAuthor, isManager } = require('../middleware');

router.route('/register')
    .get(isLoggedIn, isAdmin, catchAsync(users.renderRegister))
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout)

router.route('/attendance')
    .get(isLoggedIn, catchAsync(users.renderAttendance))
    .post(isLoggedIn, catchAsync(users.markAttendance))

router.get('/mentee/requests', isLoggedIn, isManager, catchAsync(users.renderMenteeRequests))
router.post('/mentee/request/approve/:id', isLoggedIn, isManager, catchAsync(users.approveRequest) )

router.get('/show', isLoggedIn, catchAsync(users.renderShow))
router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(users.renderEditForm))

router.route('/request/:id')
    .delete(isLoggedIn, isAuthor, catchAsync(users.deleteRequest))

router.route('/:id')
    .put(isLoggedIn, isAdmin, catchAsync(users.updateUser))
    .delete(isLoggedIn, isAdmin, catchAsync(users.deleteUser))


module.exports = router;