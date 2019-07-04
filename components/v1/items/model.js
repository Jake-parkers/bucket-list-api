const Database = require('../../../libraries/database');
const db = new Database();
const dbDriver = db.connect();
const uuid = require('uuid/v4');
const BucketList = require('../bucket_list/model');

class Item {
    constructor(name, done, id, date_created, date_modified) {
        this.id = id || uuid();
        this.name = name;
        this.done = done || false;
        this.date_created = date_created || null;
        this.date_modified = date_modified || null;
    }

    save(bucket_id) {
        const session = dbDriver.session();
        const today = new Date();
        this.date_created = today.toLocaleDateString() + ' ' + today.toLocaleTimeString();
        return new Promise((resolve, reject) => {
            const writeTx = session.writeTransaction((tx) => {
                // a user 'OWNS' bucket lists
                return tx.run(
                    "MATCH(bucket:BucketList {bucket_id: $bucket_id}) CREATE (item:Item {item_id: $item_id, name: $name, done: $done, date_created: $date_created, date_modified: $date_modified}) MERGE (bucket)-[:CONTAINS]->(item)", {item_id: this.id, bucket_id, name: this.name, done: this.done, date_created: this.date_created, date_modified: this.date_modified}
                );
            });
            writeTx.then(result => {
                session.close();
                if ( result.summary.counters.nodesCreated() > 0 ) resolve(true);
                else resolve(false);
            }).catch(_ => {
                session.close();
                reject(new Error('An error occurred while saving bucket'));
            })
        });
    }

    static fetchAll(user_id, bucket_id) {
        const session = dbDriver.session();
        return new Promise((resolve, reject) =>  {
            const readTx = session.readTransaction((tx) => {
                return tx.run(
                    "MATCH (user:Person {user_id: $user_id})-[:OWNS]->(bucket:BucketList {bucket_id: $bucket_id})-[:CONTAINS]->(item:Item) return item.item_id as id, item.name as name, item.date_created as date_created, item.date_modified as date_modified, item.done as done", {user_id, bucket_id}
                );
            });
            readTx.then(result => {
                session.close();
                if(result.records.length > 0) {
                    let items = result.records.map(record => {
                        return {
                            id: record.get('id'),
                            name: record.get('name'),
                            done: record.get('done'),
                            date_created: record.get('date_created'),
                            date_modified: record.get('date_modified'),
                        };
                    });
                    resolve(items);
                } else {
                    resolve(false);
                }
            }).catch(_ => {
                session.close();
                reject(new Error('An error occurred while fetching user bucket'));
            })
        });
    }

    fetch(user_id, bucket_id) {
        const session = dbDriver.session();
        return new Promise((resolve, reject) =>  {
            const readTx = session.readTransaction((tx) => {
                return tx.run(
                    "MATCH (user:Person {user_id: $user_id})-[:OWNS]->(bucket:BucketList {bucket_id: $bucket_id})-[:CONTAINS]->(item:Item {item_id: $item_id}) return item.item_id as id, item.name as name, item.date_created as date_created, item.date_modified as date_modified, item.done as done", {user_id, bucket_id, item_id: this.id}
                );
            });
            readTx.then(result => {
                session.close();
                if(result.records.length > 0) {
                    let item = result.records.map(record => {
                        return {
                            id: record.get('id'),
                            name: record.get('name'),
                            done: record.get('done'),
                            date_created: record.get('date_created'),
                            date_modified: record.get('date_modified'),
                        };
                    });
                    resolve(item);
                } else {
                    resolve(false);
                }
            }).catch(_ => {
                session.close();
                reject(new Error('An error occurred while fetching user bucket'));
            })
        });
    }

    update(user_id, bucket_id) {
        const session = dbDriver.session();
        const today = new Date();
        this.date_modified = today.toLocaleDateString() + ' ' + today.toLocaleTimeString();
        return new Promise((resolve, reject) =>  {
            const readTx = session.readTransaction((tx) => {
                return tx.run(
                    "MATCH (user:Person {user_id: $user_id})-[:OWNS]->(bucket:BucketList {bucket_id: $bucket_id})-[:CONTAINS]->(item:Item {item_id: $item_id}) set item.name = $new_name, item.done = $done, item.date_modified = $date_modified", {user_id, bucket_id, item_id: this.id, new_name: this.name, done: this.done, date_modified: this.date_modified}
                );
            });
            readTx.then(result => {
                session.close();
                if ( result.summary.counters.propertiesSet() > 0 ) resolve(true);
                else resolve(false);
            }).catch(_ => {
                session.close();
                reject(new Error('An error occurred while fetching user bucket'));
            })
        });
    }

    delete() {
        const session = dbDriver.session();
        const today = new Date();
        this.date_modified = today.toLocaleDateString() + ' ' + today.toLocaleTimeString();
        return new Promise((resolve, reject) =>  {
            const readTx = session.readTransaction((tx) => {
                return tx.run(
                    "MATCH (item:Item {item_id: $item_id}) detach delete item", {item_id: this.id}
                );
            });
            readTx.then(result => {
                session.close();
                if ( result.summary.counters.nodesDeleted() > 0 ||  result.summary.counters.relationshipsDeleted() > 0) resolve(true);
                else resolve(false);
            }).catch(_ => {
                session.close();
                reject(new Error('An error occurred while fetching user bucket'));
            })
        });
    }
}

module.exports = Item;
