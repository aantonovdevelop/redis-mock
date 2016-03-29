'use strict';

var assert = require('assert');
var redis = require('../src/redis.js');

describe('Redis', function () {
    beforeEach(function () {
        redis.store = [];
    });

    describe('#get', function () {
        it('Should return value by key', function (done) {
            var test_key = 'test_key';
            var test_value = 'test_value';

            redis.store[test_key] = test_value;

            redis.get(test_key, function (error, value) {
                assert.equal(error, null);
                assert.ok(value);
                assert.equal(value, test_value);

                done();
            });
        });
    });

    describe('#set', function () {
        it('Should save value into db', function (done) {
            var test_key = 'test_key';
            var test_value = 'test_value';

            redis.set(test_key, test_value, function (error) {
                assert.equal(error, null);
                assert.equal(redis.store[test_key], test_value);

                done();
            });
        });
    });

    describe('#del', function () {
        it('Should delete value from db', function (done) {
            var test_key = 'test_key';

            redis.store[test_key] = 'test_value';

            redis.del(test_key, function (error) {
                assert.equal(error, null);
                assert.equal(redis.store[test_key], null);

                done();
            });
        });
    });

    describe('#incr', function () {
        it('Should increment value in db', function (done) {
            var test_key = 'test_key';

            redis.incr(test_key, function (error, result) {
                assert.equal(error, null);
                assert.equal(redis.store[test_key], 1);
                assert.equal(result, 1);

                redis.incr(test_key, function (error, result) {
                    assert.equal(error, null);
                    assert.equal(redis.store[test_key], 2);
                    assert.equal(result, 2);

                    done();
                });
            });
        });
    });

    describe('#sadd', function () {
        it('Should add item in set', function (done) {
            var test_key = 'test_key';
            var test_value = 'test_value';

            redis.sadd(test_key, test_value, function (error) {
                assert.equal(error, null);

                assert.equal(redis.store[test_key] instanceof Array, true);
                assert.equal(redis.store[test_key][0], test_value);

                done();
            });
        });
    });

    describe('#smembers', function () {
        it('Should get all members in set', function (done) {
            var test_key = 'test_key';
            var test_value = 'test_value';

            redis.store[test_key] = [];
            redis.store[test_key].push(test_value);

            redis.smembers(test_key, function (error, values) {
                assert.equal(error, null);
                assert.equal(values[0], test_value);

                done();
            });
        });
    });

    describe('#srem', function () {
        it('Should remove item from set', function (done) {
            var test_key = 'test_key';
            var first_test_value = 'first_test_value';
            var second_test_value = 'second_test_value';

            redis.store[test_key] = [];

            redis.store[test_key].push(first_test_value);
            redis.store[test_key].push(second_test_value);

            redis.srem(test_key, second_test_value, function (error) {
                assert.equal(error, null);

                assert.equal(redis.store[test_key][0], first_test_value);
                assert.equal(redis.store[test_key][1], undefined);

                done();
            });
        });
    });

    describe('#exists', function () {
        it('Should return 1 if key exists or 0 if not', function (done) {
            var test_such_key = 'test_key_1';
            var test_not_such_key = 'test_key_2';

            redis.store[test_such_key] = 'some';

            redis.exists(test_such_key, function (error, result) {
                assert.equal(error, null);
                assert.equal(result, 1);

                redis.exists(test_not_such_key, function (error, result) {
                    assert.equal(error, null);
                    assert.equal(result, 0);

                    done();
                });
            });
        });
    });

    describe('#sinter', function () {
        it('Should return items contained in all keys', function (done) {
            var test_key_1 = 'test_key_1';
            var test_key_2 = 'test_key_2';

            redis.store[test_key_1] = [1, 2];
            redis.store[test_key_2] = [2];

            redis.sinter([test_key_1, test_key_2], function (error, result) {
                assert.equal(result[0], 2);

                done();
            });
        });

        it('Should return items contained in one key', function (done) {
            redis.store = [];

            var test_key_1 = 'test_key_1';
            var test_key_2 = 'test_key_2';

            redis.store[test_key_1] = [1, 2];
            redis.store[test_key_2] = [2];

            redis.sinter([test_key_1], function (error, result) {
                assert.equal(error, null);
                assert.equal(result.length, 2);

                done();
            });
        });
    });

    describe('#hset', function () {
        var hashkey = 'hashkey';

        var hashfield_1 = 'field_1';
        var hashfield_2 = 'field_2';

        var hashvalue_1 = 'value_1';
        var hashvalue_2 = 'value_2';

        it('Should set hash item', function(done) {
            redis.hset(hashkey, hashfield_1, hashvalue_1, function (error) {
                if (error) {
                    return done(error);
                }

                redis.hset(hashkey, hashfield_2, hashvalue_2, function (error) {
                    done(error);
                });
            });
        });

        after('Check db values', function () {
            assert.equal(redis.store[hashkey] instanceof Array, true);

            assert.equal(redis.store[hashkey][hashfield_1], hashvalue_1);
            assert.equal(redis.store[hashkey][hashfield_2], hashvalue_2);
        });
    });

    describe('#hget', function () {
        var hashkey = 'hashkey';
        var hashfield = 'hashfield';
        var hashvalue = 'hashvalue';

        it('Should return value of hash field', function (done) {
            redis.store[hashkey] = [];
            redis.store[hashkey][hashfield] = hashvalue;

            redis.hget(hashkey, hashfield, function (error, result) {
                assert.equal(error, null);
                assert.equal(result, hashvalue);

                done();
            });
        });
    });

    describe('#hgetall', function () {
        var hashkey = 'hashkey';

        var hashfield_1 = 'field_1';
        var hashfield_2 = 'field_2';

        var hashvalue_1 = 'value_1';
        var hashvalue_2 = 'value_2';

        it('Should get all fields of hash', function (done) {
            redis.store[hashkey] = [];
            redis.store[hashkey][hashfield_1] = hashvalue_1;
            redis.store[hashkey][hashfield_2] = hashvalue_2;

            redis.hgetall(hashkey, function (error, result) {
                assert.equal(error, null);

                assert.equal(result[hashfield_1], hashvalue_1);
                assert.equal(result[hashfield_2], hashvalue_2);

                done();
            });
        });
    });
    
    describe('#watch', function () {
        it('Should exec callback function', function (done) {
            redis.watch('some_key', done);
        });
    });
    
    describe('#multi', function () {
        it('Should return redis object', function () {
            assert.equal(redis.multi(), redis);
        });
    });
    
    describe('#exec', function () {
        it('Should exec callback function', function (done) {
            redis.exec(done);
        });
    });
});
