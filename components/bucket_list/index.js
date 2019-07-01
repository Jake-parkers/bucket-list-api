const router = require('express').Router();
const BucketListController = require('./controller');
const controller = new BucketListController();

router.get('/', (req, res) => {
    res.status(200).send("Bucket List Project");
});

module.exports = router;
