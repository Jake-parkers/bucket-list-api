const Database = require('../../libraries/database');
const db = new Database();
const dbDriver = db.connect();
const uuidv4 = require('uuid/v4');

class Auth {
    constructor() {}
}

module.exports = Auth;
