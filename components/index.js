const app = require('express')();
const cors = require('cors');
const morgan = require('morgan');
const Sentry = require('@sentry/node/dist/index');
const bodyParser = require('body-parser');
const apiV1 = require('./v1');

Sentry.init({ dsn: process.env.SENTRY_TOKEN });

app.use(Sentry.Handlers.requestHandler());


// Middleware -
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(morgan('combined'));

app.use(cors({
    origin: process.env.NODE_ENV === 'development' ? process.env.FRONTEND_LOCAL_URL : process.env.FRONTEND_PRODUCTION_URL
}));

app.get('/', (req, res) => {
    res.status(200).send("Bucketlist Project");
});

// routes
app.use('/api/v1', apiV1);

// The sentry error handler must be before any other error middleware
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
    process.exit(1);
});

module.exports = app;
