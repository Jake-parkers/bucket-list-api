require('dotenv').config();
const app = require('./components');
const port = process.env.PORT || 3000;

// process.on('uncaughtException', function (err) {
//     logger.info((new Date).toUTCString() + ' uncaughtException:', err.message);
//     logger.info(err.stack);
//     process.exit(1);
// });

app.listen(port, '', () => {
    console.log(`App Listening On Port ${port}`);
});
