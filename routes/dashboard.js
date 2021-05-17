const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboard')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

router.route('/')
    .get(isLoggedIn,catchAsync(dashboard.index))

module.exports = router;