const Database = require('../../../libraries/database');
const db = new Database();
const dbDriver = db.connect();
const uuidv4 = require('uuid/v4');

class Auth {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    userExists() {
        const session = dbDriver.session();
        return new Promise((resolve, reject) => {
           const readTx = session.readTransaction((tx) => {
               return tx.run(
                   "MATCH (user:Person {email: $email}) return user.user_id as user_id, user.password as hash", {email: this.email}
               );
           });
           readTx.then(result => {
               session.close();
               // if user exists, return his hashed password
               if (result.records.length > 0) {
                   let user = result.records.map(record => {
                       return {
                           hash: record.get('hash'),
                           user_id: record.get('user_id'),
                       }
                   });
                   resolve(user[0]);
               } else resolve(null);
           }).catch(_ => {
               session.close();
               reject(new Error("An error occurred. Try again"));
           })
        });
    }

    save() {
        const session = dbDriver.session();
        const userId = uuidv4();
        const today = new Date();
        const date_created = today.toLocaleDateString() + ' ' + today.toLocaleTimeString();
        return new Promise((resolve, reject) => {
            const writeTx = session.writeTransaction((tx) => {
                return tx.run(
                    "CREATE (user:Person {user_id: $id, email: $email, password: $password, date_created: $date_created})", {id: userId, email: this.email, password: this.password, date_created: date_created}
                );
            });
            writeTx.then(result => {
                session.close();
                if ( result.summary.counters.nodesCreated() > 0 ) resolve(userId);
                else resolve(false);
            }).catch(_ => {
                session.close();
                reject(new Error('An error occurred while saving user'));
            })
        });
    }
}

module.exports = Auth;
