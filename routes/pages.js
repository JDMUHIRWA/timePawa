const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('Login');
});

router.get('/Register', (req, res) => {
    res.render('about');
});

module.exports = router;