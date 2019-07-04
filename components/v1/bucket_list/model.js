const Database = require('../../../libraries/database');
const db = new Database();
const dbDriver = db.connect();
const uuidv4 = require('uuid/v4');
const Item = require('../items/model');
const Transformer = require('./transformer');
class BucketList {
    constructor(name, user_id, bucket_id, date_created, date_modified, items) {
        this.bucket_id = bucket_id || uuidv4();
        this.items = items || null;
        this.name = name;
        this.user_id = user_id;
        this.date_created = date_created || null;
        this.date_modified = date_modified || null;
    }

    static bucketExists(user_id, bucket_name) {
        const session = dbDriver.session();
        return new Promise((resolve, reject) => {
            const readTx = session.readTransaction((tx) => {
                return tx.run(
                    "MATCH (user:Person {user_id: $user_id})-[:OWNS]->(bucket:BucketList {name: $bucket_name}) return bucket.bucket_id as bucket_id", {bucket_name: bucket_name, user_id: user_id}
                );
            });
            readTx.then(result => {
                session.close();
                if (result.records.length > 0) {
                    resolve(result.records[0].get('bucket_id'));
                } else resolve(false);
            }).catch(error => {
                console.log(error);
                session.close();
                reject(new Error('An error occurred while checking bucket'));
            })
        })
    }

    save() {
        const session = dbDriver.session();
        const today = new Date();
        this.date_created = today.toLocaleDateString() + ' ' + today.toLocaleTimeString();
        return new Promise((resolve, reject) => {
            const writeTx = session.writeTransaction((tx) => {
                // a user 'OWNS' bucket lists
                return tx.run(
                    "MATCH(user: Person {user_id: $user_id}) CREATE (bucket: BucketList {bucket_id: $bucket_id, name: $name, date_created: $date_created, date_modified: $date_modified}) MERGE (user)-[:OWNS]->(bucket)", {bucket_id: this.bucket_id, name: this.name, date_created: this.date_created, date_modified: this.date_modified, items: this.items, user_id: this.user_id}
                );
            });
            writeTx.then(result => {
                session.close();
                if ( result.summary.counters.nodesCreated() > 0 ) resolve(true);
                else resolve(false);
            }).catch(error => {
                session.close();
                reject(new Error('An error occurred while saving bucket'));
            })
        });
    }

    /**
     * gets the total number of buckets a user has
     * @param user_id
     * @returns {Promise<any>}
     */
    static fetchAll(user_id) {
        const session = dbDriver.session();
        return new Promise((resolve, reject) =>  {
            const readTx = session.readTransaction((tx) => {
                return tx.run(
                    "MATCH (user:Person {user_id: $user_id})-[:OWNS]->(bucket:BucketList) OPTIONAL MATCH (bucket)-[rel:CONTAINS]->(item:Item) return bucket.bucket_id as id, bucket.name as name, bucket.date_created as date_created, bucket.date_modified as date_modified, user.user_id as created_by, item.item_id as item_id, item.name as item_name, item.done as item_done, item.date_created as item_date_created, item.date_modified as item_date_modified", {user_id}
                );
            });
            readTx.then(result => {
                session.close();
                if(result.records.length > 0) {
                    let bucketList = result.records.map(record => {
                        return {
                            id: record.get('id'),
                            name: record.get('name'),
                            items: record.get('item_id') !== null ? new Item(record.get('item_name'), record.get('item_done'), record.get('item_id'), record.get('date_created'), record.get('date_modified')) : null,
                            date_created: record.get('date_created'),
                            date_modified: record.get('date_modified'),
                            created_by: record.get('created_by')
                        };
                    });
                    resolve(Transformer.transformBucketList(bucketList).length);
                } else {
                    resolve(false);
                }
            }).catch(_ => {
                session.close();
                reject(new Error('An error occurred while fetching user bucket'));
            })
        });
    }

    fetchAll(limit, page) {
        const skip = (Number(page) - 1) * limit;
        const session = dbDriver.session();
        return new Promise((resolve, reject) =>  {
            const readTx = session.readTransaction((tx) => {
                return tx.run(
                    "MATCH (user:Person {user_id: $user_id})-[:OWNS]->(bucket:BucketList) OPTIONAL MATCH (bucket)-[rel:CONTAINS]->(item:Item) return bucket.bucket_id as id, bucket.name as name, bucket.date_created as date_created, bucket.date_modified as date_modified, user.user_id as created_by, item.item_id as item_id, item.name as item_name, item.done as item_done, item.date_created as item_date_created, item.date_modified as item_date_modified, count(*) as no_of_buckets SKIP " + skip + " LIMIT " + limit, {user_id: this.user_id}
                );
            });
            readTx.then(result => {
                session.close();
                if(result.records.length > 0) {
                    let bucketList = result.records.map(record => {
                        return {
                            id: record.get('id'),
                            name: record.get('name'),
                            items: record.get('item_id') !== null ? new Item(record.get('item_name'), record.get('item_done'), record.get('item_id'), record.get('date_created'), record.get('date_modified')) : null,
                            date_created: record.get('date_created'),
                            date_modified: record.get('date_modified'),
                            created_by: record.get('created_by')
                        };
                    });
                    resolve(Transformer.transformBucketList(bucketList));
                } else {
                    resolve(false);
                }
            }).catch(_ => {
                session.close();
                reject(new Error('An error occurred while fetching user bucket'));
            })
        });
    }

    fetchSingle() {
        const session = dbDriver.session();
        return new Promise((resolve, reject) =>  {
            const readTx = session.readTransaction((tx) => {
                return tx.run(
                    "MATCH (user:Person {user_id: $user_id})-[:OWNS]->(bucket:BucketList {bucket_id: $bucket_id}) OPTIONAL MATCH (bucket)-[:CONTAINS]->(item:Item) return bucket.bucket_id as id, bucket.name as name, bucket.date_created as date_created, bucket.items as items, bucket.date_modified as date_modified, user.user_id as created_by, item.item_id as item_id, item.name as item_name, item.done as item_done, item.date_created as item_date_created, item.date_modified as item_date_modified", {bucket_id: this.bucket_id, user_id: this.user_id}
                );
            });
            readTx.then(result => {
                session.close();
                if(result.records.length > 0) {
                    let bucketList = result.records.map(record => {
                        return {
                            id: record.get('id'),
                            name: record.get('name'),
                            items: record.get('item_id') !== null ? new Item(record.get('item_name'), record.get('item_done'), record.get('item_id'), record.get('date_created'), record.get('date_modified')) : null,
                            date_created: record.get('date_created'),
                            date_modified: record.get('date_modified'),
                            created_by: record.get('created_by')
                        };
                    });
                    resolve(Transformer.transformBucketList(bucketList));
                } else {
                    resolve(false);
                }
            }).catch(_ => {
                session.close();
                reject(new Error('An error occurred while fetching bucket'));
            })
        });
    }

    update() {
        const session = dbDriver.session();
        const today = new Date();
        this.date_modified = today.toLocaleDateString() + ' ' + today.toLocaleTimeString();
        return new Promise((resolve, reject) =>  {
            const readTx = session.readTransaction((tx) => {
                return tx.run(
                    "MATCH (bucket:BucketList {bucket_id: $bucket_id}) set bucket.name = $bucket_name, bucket.date_modified = $date_modified", {bucket_id: this.bucket_id, bucket_name: this.name, $date_modified: this.date_modified}
                );
            });
            readTx.then(result => {
                session.close();
                if ( result.summary.counters.propertiesSet() > 0 ) resolve(true);
                else resolve(false);
            }).catch(_ => {
                session.close();
                reject(new Error('An error occurred while updating bucket'));
            })
        });
    }

    delete() {
        const session = dbDriver.session();
        return new Promise((resolve, reject) =>  {
            const readTx = session.readTransaction((tx) => {
                return tx.run(
                    "MATCH (bucket:BucketList {bucket_id: $bucket_id}) detach delete bucket", {bucket_id: this.bucket_id}
                );
            });
            readTx.then(result => {
                session.close();
                if ( result.summary.counters.nodesDeleted() > 0 ||  result.summary.counters.relationshipsDeleted() > 0) resolve(true);
                else resolve(false);
            }).catch(_ => {
                session.close();
                reject(new Error('An error occurred while deleting bucket'));
            })
        });
    }

    search() {
        const session = dbDriver.session();
        return new Promise((resolve, reject) =>  {
            const readTx = session.readTransaction((tx) => {
                return tx.run(
                    "MATCH (user:Person {user_id: $user_id})-[:OWNS]->(bucket:BucketList {name: $bucket_name}) OPTIONAL MATCH (bucket)-[:CONTAINS]->(item:Item) return bucket.bucket_id as id, bucket.name as name, bucket.date_created as date_created, bucket.items as items, bucket.date_modified as date_modified, user.user_id as created_by, item.item_id as item_id, item.name as item_name, item.done as item_done, item.date_created as item_date_created, item.date_modified as item_date_modified", {bucket_name: this.name, user_id: this.user_id}
                );
            });
            readTx.then(result => {
                session.close();
                if(result.records.length > 0) {
                    let bucketList = result.records.map(record => {
                        return {
                            id: record.get('id'),
                            name: record.get('name'),
                            items: record.get('item_id') !== null ? new Item(record.get('item_name'), record.get('item_done'), record.get('item_id'), record.get('date_created'), record.get('date_modified')) : null,
                            date_created: record.get('date_created'),
                            date_modified: record.get('date_modified'),
                            created_by: record.get('created_by')
                        };
                    });
                    resolve(Transformer.transformBucketList(bucketList));
                } else {
                    resolve(false);
                }
            }).catch(_ => {
                session.close();
                reject(new Error('An error occurred while fetching bucket'));
            })
        });
    }
}

module.exports = BucketList;
