const router = require('express').Router();
const AuthController = require('./controller');
const controller = new AuthController();
const Response = require('../../libraries/response');
const Errors = require('../../libraries/errors');
const Misc = require('../../libraries/misc');
const requireTokenAuth = require('../auth_middleware');

router.get('/', (req, res) => {
    res.status(200).send("Auth route");
});

router.post('/login', (req, res) => {
    controller.login(req.body)
        .then(response => {
            res.status(response.status_code).send(Misc.formattedResponse(response));
        }).catch(error => {
            res.status(500).send(Misc.formattedResponse(new Response('error', Errors.server_error, error.message, 500)));
        })
});

router.post('/register', (req, res) => {
    controller.register(req.body)
        .then(response => {
            res.status(response.status_code).send(Misc.formattedResponse(response));
        }).catch(error => {
            res.status(500).send(Misc.formattedResponse(new Response('error', Errors.server_error, error.message, 500)));
        })
});

router.get('/logout', requireTokenAuth, (req, res) => {
    res.status(200).send(Misc.formattedResponse(new Response('success', Errors.none, { token: null }, 200)));
});

module.exports = router;
