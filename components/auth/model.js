const Database = require('../../libraries/database');
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
                   "MATCH (user:Person {email: $email}) return user.password as hash", {email: this.email}
               );
           });
           readTx.then(result => {
               session.close();
               // if user exists, return his hashed password
               if (result.records.length > 0) {
                   let user = result.records.map(record => {
                       return {
                           hash: record.get('hash'),
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
        return new Promise((resolve, reject) => {
            const writeTx = session.writeTransaction((tx) => {
                return tx.run(
                    "MERGE (user:Person {user_id: $id, email: $email, password: $password})", {id: uuidv4(), email: this.email, password: this.password}
                );
            });
            writeTx.then(result => {
                session.close();
                if ( result.summary.counters.nodesCreated() > 0 ) resolve(true);
                else resolve(false);
            }).catch(_ => {
                session.close();
                reject(new Error('An error occurred while saving user'));
            })
        });
    }
}

module.exports = Auth;
