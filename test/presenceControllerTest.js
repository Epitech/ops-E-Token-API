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

describe('presence', function () {
    before(function() {
        chai.request(server)
            .get('/')
    });

    describe('unauthorized user', function () {
        it('should return unauthorized on get presence', function (done) {
            chai.request(server)
                .get('/presence/a/b/c/d/e')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('should return unauthorized on add new card', function (done) {
            chai.request(server)
                .put('/presence/a/b/c/d/e')
                .send({login: 'test.test@epitech.eu', present: 'present'})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('should return unauthorized on delete presence', function (done) {
            chai.request(server)
                .delete('/presence/a/b/c/d/e')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('authorized user', function () {
        before(function () {
            fetchMock.get('https://intra.epitech.eu/user/?format=json', {
                groups: [{title: 'Pedago', name: 'pedago', count: 1}]
            });
            fetchMock.get('https://intra.epitech.eu/module/a/b/c?format=json', {
                rights: ['prof_inst']
            });
        });

        it('should return null students', function (done) {
            chai.request(server)
                .get('/presence/a/b/c/d/e')
                .set({'Authorization': 'Bearer ' + mockToken})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.eql({students: null});
                    done();
                });
        });

        it('should add student as present', function (done) {
            chai.request(server)
                .put('/presence/a/b/c/d/e')
                .set({'Authorization': 'Bearer ' + mockToken})
                .send({login: 'test.test@epitech.eu', present: 'present'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.eql({message: 'Added student'});
                    chai.request(server)
                        .get('/presence/a/b/c/d/e')
                        .set({'Authorization': 'Bearer ' + mockToken})
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.be.eql({students: [{login: 'test.test@epitech.eu', present: 'present'}]});
                            done();
                        });
                });
        });

        it('should remove activity', function (done) {
            chai.request(server)
                .delete('/presence/a/b/c/d/e')
                .set({'Authorization': 'Bearer ' + mockToken})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.eql({message: 'Removed activity'});
                    chai.request(server)
                        .get('/presence/a/b/c/d/e')
                        .set({'Authorization': 'Bearer ' + mockToken})
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.be.eql({students: null});
                            done();
                        });
                });
        });

        after(() => fetchMock.restore());
    });
});