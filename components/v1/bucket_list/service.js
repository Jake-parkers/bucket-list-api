const BucketListModel = require('./model');
const ItemModel = require('../items/model');
class BucketListService {
    constructor () {}

    createBucket(payload) {
        return new Promise((resolve, reject) => {
            const Bucket = new BucketListModel(payload.name, payload.user_id);
            BucketListModel.bucketExists(payload.user_id, payload.name)
                .then(result => {
                    if (result === false) { // bucket with this.name doesn't exist yet - create bucket
                        Bucket.save()
                            .then(result => {
                                resolve(Bucket)
                            }).catch(error => {
                                reject(error);
                            });
                    } else {
                        resolve(false);
                    }
                }).catch(error => {
                    reject(error);
                });
        });
    }

    fetchUserBuckets(payload) {
        return new Promise((resolve, reject) => {
            const Bucket = new BucketListModel('', payload.user_id);
            if (payload.q !== undefined) { // fetch bucket by it's name
                BucketListService.findBucket(payload)
                    .then(bucket => {
                        if (bucket.length > 1 ) resolve({total: bucket.length, buckets: bucket});
                        else resolve(bucket)
                    }).catch(error => {
                    reject(error);
                })
            } else { // perform pagination query
                Promise.all([
                    Bucket.fetchAll(payload.limit, payload.page),
                    BucketListModel.fetchAll(payload.user_id)
                ]).then(values => {
                    resolve({total: values[1], buckets: values[0]});
                }).catch(error => {
                    reject(error);
                })
            }
        })
    }

    fetchSingleBucket(payload) {
        return new Promise((resolve, reject) => {
            const Bucket = new BucketListModel('', payload.user_id, payload.id);
            Bucket.fetchSingle()
                .then(result => {
                    resolve(result)
                }).catch(error => {
                reject(error);
            });
        })
    }

    updateBucket(payload) {
        return new Promise((resolve, reject) => {
            const Bucket = new BucketListModel(payload.name, payload.user_id, payload.id);
            BucketListModel.bucketExists(payload.user_id, payload.name)
                .then(result => {
                    if (result === false) { // bucket with this.name doesn't exist yet - create bucket
                        Bucket.update()
                            .then(result => {
                                resolve(result)
                            }).catch(error => {
                            reject(error);
                        });
                    } else {
                        resolve(false);
                    }
                }).catch(error => {
                reject(error);
            });
        })
    }

    deleteBucket(payload) {
        // payload.id houses the bucket_id
        return new Promise((resolve, reject) => {
            const Bucket = new BucketListModel('', payload.user_id, payload.id);
            Bucket.delete()
                .then(result => {
                    resolve(result)
                }).catch(error => {
                reject(error);
            });
        })
    }

    static findBucket(payload) {
        return new Promise((resolve, reject) => {
            const Bucket = new BucketListModel(payload.q, payload.user_id);
            Bucket.search()
                .then(result => {
                    resolve(result)
                }).catch(error => {
                reject(error);
            });
        })
    }

    createItem(payload) {
        // payload.id houses the bucket_id
        return new Promise((resolve, reject) => {
            const Item = new ItemModel(payload.name, payload.done);
            ItemModel.exists(payload.user_id, payload.id, payload.name)
                .then(result => {
                    if (result === false) { // item with name doesn't exist yet - create item
                        Item.save(payload.id)
                            .then(result => {
                                resolve(Item)
                            }).catch(error => {
                                reject(error);
                            });
                    } else {
                        resolve(false);
                    }
                }).catch(error => {
                    reject(error);
                });
        });
    }

    fetchAllItems(payload) {
        return new Promise((resolve, reject) => {
            ItemModel.fetchAll(payload.user_id, payload.id)
                .then(result => {
                    resolve(result)
                }).catch(error => {
                reject(error);
            });
        })
    }

    fetchItem(payload) {
        return new Promise((resolve, reject) => {
            const Item = new ItemModel('',false,payload.item_id);
            Item.fetch(payload.user_id, payload.id)
                .then(result => {
                    resolve(result)
                }).catch(error => {
                reject(error);
            });
        })
    }

    updateItem(payload) {
        console.log(payload);
        return new Promise((resolve, reject) => {
            const Item = new ItemModel(payload.name,payload.done,payload.item_id);
            ItemModel.exists(payload.user_id, payload.id, payload.name)
                .then(result => {
                    if (result === false) {
                        Item.update(payload.user_id, payload.id)
                            .then(result => {
                                resolve(result)
                            }).catch(error => {
                                reject(error);
                            });
                    } else {
                        resolve(false)
                    }
                }).catch(error => {
                    reject(error);
                })
        })
    }

    deleteItem(payload) {
        return new Promise((resolve, reject) => {
            const Item = new ItemModel(payload.name,payload.done,payload.item_id);
            Item.delete()
                .then(result => {
                    resolve(result)
                }).catch(error => {
                reject(error);
            });
        })
    }
}

module.exports = BucketListService;
