const router = require('express').Router();
const BucketListController = require('./controller');
const controller = new BucketListController();
const Misc = require('../../libraries/misc');
const Response = require('../../libraries/response');
const Errors = require('../../libraries/errors');
const requireTokenAuth = require('../auth_middleware');

/**
 * Middleware to append request params to request body
 * @param req
 * @param res
 * @param next
 */
function appendParamToRequestBody(req, res, next) {
    const params = Object.keys(req.params);
    if (params.length === 0) next();
    else if (params.length === 1) {
        req.body[params[0]] = req.params[params];
    } else {
        for (let param of params) {
            req.body[param] = req.params[param];
        }
    }
    next();
}

function appendQueryParamsToRequestBody(req, res, next) {
    const queryParams = Object.keys(req.query);
    if (queryParams.length === 0) next();
    else if (queryParams.length === 1) {
        req.body[queryParams[0]] = req.query[queryParams];
    } else {
        for (let queryParam of queryParams) {
            req.body[queryParam] = req.query[queryParam];
        }
    }
    next();
}

/**
 * Route for bucket list creation
 */
router.post('/', requireTokenAuth, (req, res) => {
    controller.createBucket(req.body)
        .then(response => {
            res.status(response.status_code).send(Misc.formattedResponse(response));
        }).catch(error => {
            res.status(500).send(Misc.formattedResponse(new Response('error', Errors.server_error, error.message, 500)));
        });
});

/**
 * Route for fetching all bucket lists for a user
 */
router.get('/', requireTokenAuth, appendQueryParamsToRequestBody, (req, res) => {
    controller.fetchUserBuckets(req.body)
        .then(response => {
            res.status(response.status_code).send(Misc.formattedResponse(response));
        }).catch(error => {
        res.status(500).send(Misc.formattedResponse(new Response('error', Errors.server_error, error.message, 500)));
    });
});

/**
 * Route for fetching a single bucket list per user
 */
router.get('/:id', requireTokenAuth, appendParamToRequestBody, (req, res) => {
    controller.fetchSingleBucket(req.body)
        .then(response => {
            res.status(response.status_code).send(Misc.formattedResponse(response));
        }).catch(error => {
        res.status(500).send(Misc.formattedResponse(new Response('error', Errors.server_error, error.message, 500)));
    });
});

/**
 * Route for updating a bucket list
 */
router.put('/:id', requireTokenAuth, appendParamToRequestBody, (req, res) => {
    controller.updateBucket(req.body)
        .then(response => {
            res.status(response.status_code).send(Misc.formattedResponse(response));
        }).catch(error => {
        res.status(500).send(Misc.formattedResponse(new Response('error', Errors.server_error, error.message, 500)));
    });
});

/**
 * Route for deleting a bucket list
 */
router.delete('/:id', requireTokenAuth, appendParamToRequestBody, (req, res) => {
    controller.deleteBucket(req.body)
        .then(response => {
            res.status(response.status_code).send(Misc.formattedResponse(response));
        }).catch(error => {
        res.status(500).send(Misc.formattedResponse(new Response('error', Errors.server_error, error.message, 500)));
    });
});

router.post('/:id/items', requireTokenAuth, appendParamToRequestBody, (req, res) => {
    controller.createItem(req.body)
        .then(response => {
            res.status(response.status_code).send(Misc.formattedResponse(response));
        }).catch(error => {
        res.status(500).send(Misc.formattedResponse(new Response('error', Errors.server_error, error.message, 500)));
    });
});

router.get('/:id/items', requireTokenAuth, appendParamToRequestBody, (req, res) => {
    controller.fetchAllItems(req.body)
        .then(response => {
            res.status(response.status_code).send(Misc.formattedResponse(response));
        }).catch(error => {
        res.status(500).send(Misc.formattedResponse(new Response('error', Errors.server_error, error.message, 500)));
    });
});

router.get('/:id/items/:item_id', requireTokenAuth, appendParamToRequestBody, (req, res) => {
    controller.fetchItem(req.body)
        .then(response => {
            res.status(response.status_code).send(Misc.formattedResponse(response));
        }).catch(error => {
        res.status(500).send(Misc.formattedResponse(new Response('error', Errors.server_error, error.message, 500)));
    });
});

router.put('/:id/items/:item_id', requireTokenAuth, appendParamToRequestBody, (req, res) => {
    controller.updateItem(req.body)
        .then(response => {
            res.status(response.status_code).send(Misc.formattedResponse(response));
        }).catch(error => {
        res.status(500).send(Misc.formattedResponse(new Response('error', Errors.server_error, error.message, 500)));
    });
});

router.delete('/:id/items/:item_id', requireTokenAuth, appendParamToRequestBody, (req, res) => {
    controller.deleteItem(req.body)
        .then(response => {
            res.status(response.status_code).send(Misc.formattedResponse(response));
        }).catch(error => {
        res.status(500).send(Misc.formattedResponse(new Response('error', Errors.server_error, error.message, 500)));
    });
});

module.exports = router;
