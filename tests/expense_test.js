require('dotenv').config();
const assert = require('assert');
const supertest = require('supertest');
const should = require('should');
const expect = require('chai').expect;
const server = supertest.agent('localhost:3000/bucketlist');

const Errors = require('../libraries/errors');
const ExpenseModel = require('../components/bucket_list/model');
const ExpenseService = require('../components/bucket_list/service');
const expenseService = new ExpenseService();

describe('Expense Service', function() {
    describe('Create a new Expense', function () {
        it ('When the request object is invalid, the bucket_list should not be created', () => {
            server.post('/save')
                .send({date: '2019-06-24', value: '2000', reason: 'Bought Shoes'})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .then((res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body.status).to.be.equal('error');
                    expect(res.body.type).to.be.equal(Errors.invalid_params);
                })
                .catch(error => {
                    console.error(error);
                })
        });

        it ('When the request object is valid, the new bucket_list should be created', () => {
            server.post('/save')
                .send({date: '2019-06-24', value: 2000, reason: 'Bought Shoes', is_euro: true, vat: 14.90})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .then((res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.status).to.be.equal('success');
                    expect(res.body.type).to.be.equal(Errors.none);
                })
                .catch(error => {
                    throw error;
                })
        });
    });

    describe('Fetch All Expenses', function () {
        it ('All bucketlist created so far should be returned', () => {
            server.get('/fetch/all')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .then((res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.status).to.be.equal('success');
                    expect(res.body.type).to.be.equal(Errors.none);
                    expect(res.body.message).to.be.an('array')
                })
                .catch(error => {
                    console.error(error);
                })
        })
    })

});
