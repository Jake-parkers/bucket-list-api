const express = require('express');
const router = express.Router();
const bucketlist = require('./bucket_list');
const auth = require('./auth');

router.use('/bucketlists', bucketlist);
router.use('/auth', auth);

module.exports = router;
