const BucketList = require('./model');
class Transformer {
    constructor() {}

    /**
     * transforms the bucket lists for a user gotten from DB to match the format specified in the API specs
     * @param bucketlist - array
     */
    static transformBucketList(bucketlist) {
        const transformedBucketList = [];
        let prevId = '';
        for (let bucket of bucketlist) {
            bucket.items = [bucket.items];
            if (bucket.id !== prevId) {
                transformedBucketList.push(bucket);
            } else {
                for (let bucketList of transformedBucketList) {
                    if (bucket.id === bucketList.id) bucketList.items.push(bucket.items[0]);
                }
            }
            prevId = bucket.id;
        }
        return transformedBucketList;
    }

    /**
     *
     * @param bucketlist
     * @param limit
     * @param page
     * @param total
     * @returns {{first_page_url: string, path: string, per_page: *, total: *, data: null, last_page: number, last_page_url: string, next_page_url: *, prev_page_url: *, current_page: *}}
     */
    static transformBucketListPaginationResponse(bucketlist, limit, page, total) {
        const baseUrl = process.env.NODE_ENV === 'development' ? process.env.LOCAL_URL : process.env.PRODUCTION_URL;
        const last_page = Math.ceil(total / limit);
        const next_page = Number(page) + 1;
        const prev_page = Number(page) - 1;
        return {
            current_page: page,
            data: bucketlist === false ? null : bucketlist,
            first_page_url: baseUrl + '/bucketlists?page=1',
            last_page,
            last_page_url: baseUrl + '/bucketlists?page=' + last_page,
            next_page_url: total <= limit || total <= limit + bucketlist.length ? null : baseUrl + '/bucketlists?page=' + next_page,
            path: baseUrl + '/bucketlists',
            per_page: bucketlist.length,
            prev_page_url: Number(page) === 1 ? null : baseUrl + '/bucketlists?page=' + prev_page,
            total,
        }
    }
}

module.exports = Transformer;
