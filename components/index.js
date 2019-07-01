const app = require('express')();
const cors = require('cors');
const morgan = require('morgan');
const Sentry = require('@sentry/node');
const bodyParser = require('body-parser');
const bucketlist = require('./bucket_list');
const auth = require('./auth');

Sentry.init({ dsn: process.env.SENTRY_TOKEN });

app.use(Sentry.Handlers.requestHandler());


// Middleware -
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(morgan('combined'));

app.use(cors({
    origin: process.env.NODE_ENV === 'development' ? 'http://localhost:4200' : 'http://coming-soon'
}));

app.get('/', (req, res) => {
    res.status(200).send("Expenses Project");
});

// routes
app.use('/bucketlists', bucketlist);
app.use('/auth', auth);

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
