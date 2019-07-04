const BucketListService = require('./service');
const service = new BucketListService();
const Response = require('../../libraries/response');
const Validator = require('./validator');
const ItemValidator = require('../items/validator');
const Errors = require('../../libraries/errors');
const Transformer = require('./transformer');
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
class BucketListController {
    constructor() {}

    createBucket(payload) {
        return new Promise((resolve, reject) => {
            const error = Validator.validateNewBucketPayload(payload);
            if (error !== null) resolve(new Response('error', Errors.invalid_params, error, 400));
            else {
                service.createBucket(payload).then(result => {
                    if (result === false) resolve(new Response('error', Errors.bucket_exists, 'A bucket with this name exists', 400));
                    else resolve(new Response('success', Errors.none, 'Bucket created successfully', 200));
                }).catch(error => {
                    reject(new Response('error', Errors.server_error, error.message, 500));
                })
            }
        })
    }

    fetchUserBuckets(payload) {
        return new Promise((resolve, reject) => {
            const error = Validator.validateFetchUserBucketsPayload(payload);
            if (error !== null) resolve(new Response('error', Errors.invalid_params, error, 400));
            else {
                if (payload.limit === undefined) payload.limit = DEFAULT_LIMIT;
                if (payload.limit > MAX_LIMIT) payload.limit = MAX_LIMIT;
                if (payload.page !== undefined && payload.page > 1) payload.limit *= payload.page - 1;
                else payload.page = 1;

                service.fetchUserBuckets(payload)
                    .then(result => {
                        if (result === false) resolve(new Response('error', Errors.no_buckets, 'User has no saved bucket(s) yet', 400));
                        else resolve(new Response('success', Errors.none, result.buckets === undefined ? result[0] : Transformer.transformBucketListPaginationResponse(result.buckets, payload.limit, payload.page, result.total) , 200));
                    }).catch(error => {
                        reject(new Response('error', Errors.server_error, error.message, 500));
                    });
            }
        });
    }

    fetchSingleBucket(payload) {
        return new Promise((resolve, reject) => {
            const error = Validator.validateFetchSingleBucketPayload(payload);
            if (error !== null) resolve(new Response('error', Errors.invalid_params, error, 400));
            else {
                service.fetchSingleBucket(payload)
                    .then(bucket => {
                        if (bucket === false) resolve(new Response('error', Errors.no_buckets, 'Bucket doesn\'t exist', 400));
                        else resolve(new Response('success', Errors.none, bucket , 200));
                    }).catch(error => {
                        reject(new Response('error', Errors.server_error, error.message, 500));
                    });
            }
        });
    }

    findBucket(payload) {
        return new Promise((resolve, reject) => {
            const error = Validator.validateFindBucketPayload(payload);
            if (error !== null) resolve(new Response('error', Errors.invalid_params, error, 400));
            else {
                service.fetchSingleBucket(payload)
                    .then(bucket => {
                        if (bucket === false) resolve(new Response('error', Errors.no_buckets, 'Bucket doesn\'t exist', 400));
                        else resolve(new Response('success', Errors.none, bucket , 200));
                    }).catch(error => {
                    reject(new Response('error', Errors.server_error, error.message, 500));
                });
            }
        });
    }

    updateBucket(payload) {
        return new Promise((resolve, reject) => {
            const error = Validator.validateUpdateBucketPayload(payload);
            if (error !== null) resolve(new Response('error', Errors.invalid_params, error, 400));
            else {
                service.updateBucket(payload)
                    .then(result => {
                        if (result === false) resolve(new Response('error', Errors.bucket_nonexistent, 'The specified bucket doesn\'t exist.', 400));
                        else resolve(new Response('success', Errors.none, 'BucketList updated successfully' , 200));
                    }).catch(error => {
                    reject(new Response('error', Errors.server_error, error.message, 500));
                });
            }
        });
    }

    deleteBucket(payload) {
        return new Promise((resolve, reject) => {
            const error = Validator.validateFetchSingleBucketPayload(payload);
            if (error !== null) resolve(new Response('error', Errors.invalid_params, error, 400));
            else {
                service.deleteBucket(payload)
                    .then(result => {
                        if (result === false) resolve(new Response('error', Errors.no_buckets, 'No bucket to delete', 400));
                        else resolve(new Response('success', Errors.none, 'Bucket deleted successfully' , 200));
                    }).catch(error => {
                        reject(new Response('error', Errors.server_error, error.message, 500));
                    });
            }
        });
    }

    createItem(payload) {
        return new Promise((resolve, reject) => {
            const error = ItemValidator.validateNewItemPayload(payload);
            if (error !== null) resolve(new Response('error', Errors.invalid_params, error, 400));
            else {
                service.createItem(payload).then(result => {
                    if (result === false) resolve(new Response('error', Errors.bucket_nonexistent, 'Oops! Bucket the specified bucket doesn\'t exist', 400));
                    else resolve(new Response('success', Errors.none, 'Item created successfully', 200));
                }).catch(error => {
                    reject(new Response('error', Errors.server_error, error.message, 500));
                })
            }
        })
    }

    fetchAllItems(payload) {
        return new Promise((resolve, reject) => {
            const error = ItemValidator.validateFetchAllItemsPayload(payload);
            if (error !== null) resolve(new Response('error', Errors.invalid_params, error, 400));
            else {
                service.fetchAllItems(payload)
                    .then(items => {
                        if (items === false) resolve(new Response('error', Errors.no_items, 'There are no items in this bucket', 400));
                        else resolve(new Response('success', Errors.none, items , 200));
                    }).catch(error => {
                    reject(new Response('error', Errors.server_error, error.message, 500));
                });
            }
        });
    }

    fetchItem(payload) {
        return new Promise((resolve, reject) => {
            const error = ItemValidator.validateFetchItemPayload(payload);
            if (error !== null) resolve(new Response('error', Errors.invalid_params, error, 400));
            else {
                service.fetchItem(payload)
                    .then(item => {
                        if (item === false) resolve(new Response('error', Errors.no_items, 'No item found in this bucket', 400));
                        else resolve(new Response('success', Errors.none, item , 200));
                    }).catch(error => {
                    reject(new Response('error', Errors.server_error, error.message, 500));
                });
            }
        });
    }

    updateItem(payload) {
        return new Promise((resolve, reject) => {
            const error = ItemValidator.validateUpdateItemPayload(payload);
            if (error !== null) resolve(new Response('error', Errors.invalid_params, error, 400));
            else {
                service.updateItem(payload)
                    .then(result => {
                        if (result === false) resolve(new Response('error', Errors.item_nonexistent, 'The specified item doesn\'t exist.', 400));
                        else resolve(new Response('success', Errors.none, 'Item successfully updated' , 200));
                    }).catch(error => {
                    reject(new Response('error', Errors.server_error, error.message, 500));
                });
            }
        });
    }

    deleteItem(payload) {
        return new Promise((resolve, reject) => {
            const error = ItemValidator.validateFetchItemPayload(payload);
            if (error !== null) resolve(new Response('error', Errors.invalid_params, error, 400));
            else {
                service.deleteItem(payload)
                    .then(result => {
                        if (result === false) resolve(new Response('error', Errors.item_nonexistent, 'The specified item doesn\'t exist.', 400));
                        else resolve(new Response('success', Errors.none, 'Item successfully deleted' , 200));
                    }).catch(error => {
                    reject(new Response('error', Errors.server_error, error.message, 500));
                });
            }
        });
    }

}

module.exports = BucketListController;
