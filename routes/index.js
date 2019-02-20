var express = require('express');
var router = express.Router();
var indexCtrl = require('../controllers/index');

router.get('/', indexCtrl.userDetails);
router.post('/', indexCtrl.userDetails);
router.post('/search', indexCtrl.search);

module.exports = router;