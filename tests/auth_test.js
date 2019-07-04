require('dotenv').config();
const assert = require('assert');
const supertest = require('supertest');
const should = require('should');
const expect = require('chai').expect;
const server = supertest.agent('localhost:3000/auth');

const Errors = require('../libraries/errors');
const Auth = require('../components/auth/model');
const AuthService = require('../components/auth/service');
const auth = new AuthService();

describe('Auth API', function() {
    describe('User Signup', function () {
        it ('When email is empty, account should not be created', (done) => {
            server.post('/register')
                .send({email: '', password: 'skskskskks'})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it ('When password is empty, account should not be created', (done) => {
            server.post('/register')
                .send({email: 'john.doe@gmail.com', password: ''})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it ('When both email and password are empty, account should not be created', (done) => {
            server.post('/register')
                .send({email: '', password: ''})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it ('When request object is invalid, account should not be created', (done) => {
            server.post('/register')
                .send({email: 'john.doe@gmail.com', passwd: ''})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it ('When request object is valid, account should be created', (done) => {
            server.post('/register')
                .send({email: 'jakeparks@gmail.com', password: 'john119'})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('User Login', function () {
        it ('When email is empty, account should not be created', (done) => {
            server.post('/login')
                .send({email: '', password: 'skskskskks'})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it ('When password is empty, account should not be created', (done) => {
            server.post('/login')
                .send({email: 'john.doe@gmail.com', password: ''})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it ('When both email and password are empty, account should not be created', (done) => {
            server.post('/login')
                .send({email: '', password: ''})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it ('When request object is invalid, account should not be created', (done) => {
            server.post('/login')
                .send({email: 'john.doe@gmail.com', passwd: ''})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it ('When request object is valid, access token should be returned', (done) => {
            server.post('/login')
                .send({email: 'john.doe@gmail.com', password: 'john11*9'})
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
