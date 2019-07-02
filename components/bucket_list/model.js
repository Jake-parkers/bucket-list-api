const Database = require('../../libraries/database');
const db = new Database();
const dbDriver = db.connect();
const uuidv4 = require('uuid/v4');

class BucketList {
    constructor() {
    }

    save() {
        const session = dbDriver.session();
        return new Promise((resolve, reject) => {

        });
    }

    static fetchAll() {
        const session = dbDriver.session();
        return new Promise((resolve, reject) =>  {

        });
    }
}

module.exports = BucketList;
