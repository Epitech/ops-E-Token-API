/**
 * @file
 * Define the tests of the controller
 *
 * This code is the property of Epitech
 * Contact: mickael.leclerc@epitech.eu
 */

'use strict';

import { use, request } from 'chai';
import chaiHttp from 'chai-http';
import { get, restore } from 'fetch-mock';
import server from '../server';
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3QudGVzdEBlcGl0ZWNoLmV1In0.gje05RjciNB42ZGcAnFZBoVxbeTh38nvwCbdgUTXR6Q';

use(chaiHttp);
use(require('./middleware'));

describe('presence', function () {
    describe('unauthorized user', function () {
        it('should return unauthorized on get presence', function (done) {
            request(server)
                .get('/presence/a/b/c/d/e')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('should return unauthorized on add new card', function (done) {
            request(server)
                .put('/presence/a/b/c/d/e')
                .send({login: 'test.test@epitech.eu', present: 'present'})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('should return unauthorized on delete presence', function (done) {
            request(server)
                .delete('/presence/a/b/c/d/e')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('authorized user', function () {
        before(function () {
            get('https://intra.epitech.eu/group/pedago/member?format=json&nolimit=1', [
                {'type': 'user', 'login': 'test.test@epitech.eu'}
            ]);
            get('https://intra.epitech.eu/module/a/b/c?format=json', {
                rights: ['prof_inst']
            });
        });

        it('should return null students', function (done) {
            request(server)
                .get('/presence/a/b/c/d/e')
                .set({'Authorization': 'Bearer ' + mockToken})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.eql({students: []});
                    done();
                });
        });

        it('should add student as present', function (done) {
            request(server)
                .put('/presence/a/b/c/d/e')
                .set({'Authorization': 'Bearer ' + mockToken})
                .send({login: 'test.test@epitech.eu', present: 'present'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.eql({message: 'Added student'});
                    request(server)
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
            request(server)
                .delete('/presence/a/b/c/d/e')
                .set({'Authorization': 'Bearer ' + mockToken})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.eql({message: 'Removed activity'});
                    request(server)
                        .get('/presence/a/b/c/d/e')
                        .set({'Authorization': 'Bearer ' + mockToken})
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.be.eql({students: []});
                            done();
                        });
                });
        });

        after(() => restore());
    });
});
