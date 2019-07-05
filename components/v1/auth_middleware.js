const jsonwebtoken = require('jsonwebtoken');
const Response = require('../../libraries/response');
const Errors = require('../../libraries/errors');
/**
 * This function checks if the authorization header is present for routes that are protected and hence require that it be available.
 * If the authorization header is not set in the format 'Bearer jwt-token', an Unauthorized error will be thrown and the client will not be able to access the route
 */
const requireAuthentication = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send(new Response('error', Errors.auth_header_missing, "You are not authorized to access this resource"));
    }

    let token = req.headers.authorization.split(" ");
    if (token[0] !== 'Bearer') {
        return res.status(400).send(new Response('error', Errors.invalid_token, "Token type is not valid. Should be of type bearer"));
    }
    jsonwebtoken.verify(token[1], process.env.JWT_SECRET, {
        algorithms: ["HS256"],
        audience: process.env.API_AUDIENCE,
        issuer: process.env.API_ISSUER
    }, (err, decoded) => {
        if (err) {
            console.log(err);
            if (err.name === 'TokenExpiredError') {
                return res.status(400).send(new Response('error', err.name, err.message))
            } else return res.status(400).send(new Response('error', Errors.invalid_token, "Access token supplied is not valid"))
        }
        // attach user id to body of authenticated requests;
        req.body.user_id = decoded.user_id;
        next();
    })
};

module.exports = requireAuthentication;
