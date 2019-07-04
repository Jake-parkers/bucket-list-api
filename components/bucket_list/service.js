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
        });
    }

    fetchUserBuckets(payload) {
        console.log(payload);
        return new Promise((resolve, reject) => {
            const Bucket = new BucketListModel('', payload.user_id);
            Promise.all([
                Bucket.fetchAll(payload.limit, payload.page),
                BucketListModel.fetchAll(payload.user_id)
            ]).then(values => {
                resolve({total: values[1], buckets: values[0]});
            }).catch(error => {
                reject(error);
            })
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
            Bucket.update()
                .then(result => {
                    resolve(result)
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

    createItem(payload) {
        // payload.id houses the bucket_id
        return new Promise((resolve, reject) => {
            const Item = new ItemModel(payload.name, payload.done);
            Item.save(payload.id)
                .then(result => {
                    resolve(result)
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
        return new Promise((resolve, reject) => {
            const Item = new ItemModel(payload.name,payload.done,payload.item_id);
            Item.update(payload.user_id, payload.id)
                .then(result => {
                    resolve(result)
                }).catch(error => {
                reject(error);
            });
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
