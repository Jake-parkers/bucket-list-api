require('dotenv').config();
const assert = require('assert');
const supertest = require('supertest');
const should = require('should');
const expect = require('chai').expect;
const server = supertest.agent('localhost:3000/bucketlists');

const Errors = require('../libraries/errors');
const BucketList = require('../components/bucket_list/model');
const BucketListService = require('../components/bucket_list/service');
const bucketListService = new BucketListService();
const AuthService = require('../components/auth/service');
const auth = new AuthService();

describe('Bucket List API', function () {
    describe('Bucket Creation', function () {
        it ('When name is empty, bucket should not be created', (done) => {
            auth.register({email: 'test@test.com', password: 'tester'})
                .then(user_id => {
                    server.post('/')
                        .send({name: '', user_id})
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end((err) => {
                            if (err) return done(err);
                            done();
                        });
                });
        });

        it ('When user_id is empty, bucket should not be created', (done) => {
            server.post('/')
                .send({name: 'Scandals', user_id: ''})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it ('When both name and user_id are empty, bucket should not be created', (done) => {
            server.post('/')
                .send({name: '', user_id: ''})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it ('When request object is valid,  bucket should be created', (done) => {
            auth.register({email: 'test@test.com', password: 'tester'})
                .then(user_id => {
                    server.post('/')
                        .send({name: 'Scandals', user_id})
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err) => {
                            if (err) return done(err);
                            done();
                        });
                });
        });
    });
});
