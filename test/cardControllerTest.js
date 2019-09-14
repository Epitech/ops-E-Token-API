/**
 * @file
 * Define the tests of the controller
 *
 * This code is the property of Epitech
 * Contact: mickael.leclerc@epitech.eu
 */

'use strict';

let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiFetchMock = require('chai-fetch-mock');
let fetchMock = require('fetch-mock');
let server = require('../server');
let should = chai.should();
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3QudGVzdEBlcGl0ZWNoLmV1In0.gje05RjciNB42ZGcAnFZBoVxbeTh38nvwCbdgUTXR6Q';

chai.use(chaiHttp);
chai.use(chaiFetchMock);

describe('card', function () {
    describe('unauthorized user', function () {
        before(function() {
            chai.request(server)
                .get('/')
        });

        it('should get Wrong Request response', function (done) {
            chai.request(server)
                .get('/card/0')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.eql({error: 'Wrong Request'});
                    done();
                });
        });

        it('should return unauthorized on get all card', function (done) {
            chai.request(server)
                .get('/card')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('should return unauthorized on add new card', function (done) {
            chai.request(server)
                .put('/card/05c4315a094f80')
                .send({login: 'test.test@epitech.eu'})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('should return unauthorized on delete card', function (done) {
            chai.request(server)
                .delete('/card/05c4315a094f80')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('authorized user', function () {
        before(function () {
            chai.request(server)
                .get('/')
            fetchMock.get('https://intra.epitech.eu/user/?format=json', {
                groups: [{title: 'Pedago', name: 'pedago', count: 1}]
            });
        });

        it('should add a new card', function (done) {
            chai.request(server)
                .put('/card/05c4315a094f80')
                .set({'Authorization': 'Bearer ' + mockToken})
                .send({login: 'test.test@epitech.eu'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.eql({message: 'Added card'});
                    chai.request(server)
                        .get('/card/05c4315a094f80')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.be.eql({login: 'test.test@epitech.eu'});
                            done();
                        });
                });
        });

        it('should remove a card', function (done) {
            chai.request(server)
                .delete('/card/05c4315a094f80')
                .set({'Authorization': 'Bearer ' + mockToken})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.eql({message: 'Deleted card'});
                    chai.request(server)
                        .get('/card/05c4315a094f80')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.be.eql({error: 'Wrong Request'});
                            done();
                        });
                });
        });

        it('should get all card registered', function (done) {
            chai.request(server)
                .put('/card/05c4315a094f80')
                .set({'Authorization': 'Bearer ' + mockToken})
                .send({login: 'test.test@epitech.eu'})
                .end(() => {
                    chai.request(server)
                        .put('/card/05c4315a094f81')
                        .set({'Authorization': 'Bearer ' + mockToken})
                        .send({login: 'test1.test@epitech.eu'})
                        .end(() => {
                            chai.request(server)
                                .get('/card')
                                .set({'Authorization': 'Bearer ' + mockToken})
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('array');
                                    res.body.should.be.eql(['test.test@epitech.eu', 'test1.test@epitech.eu']);
                                    done();
                                });
                        });
                });
        });

        after(() => fetchMock.restore());
    });
});