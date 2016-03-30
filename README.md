#redis-mock

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

[npm-image]: https://badge.fury.io/js/%40aantonov%2Fredis-mock.svg
[npm-url]: https://badge.fury.io/js/%40aantonov%2Fredis-mock

[travis-image]: https://travis-ci.org/aantonovdevelop/redis-mock.svg?branch=master
[travis-url]: https://travis-ci.org/aantonovdevelop/redis-mock

[coveralls-image]: https://coveralls.io/repos/aantonovdevelop/redis-mock/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/aantonovdevelop/redis-mock?branch=master

## Installation

``` bash
    $ [sudo] npm install --save @aantonov/redis-mock
```

## Usage

``` js
    var assert = require('assert');
    var redis_client = require('@aantonov/redis-mock');
    
    it ('Should save string value', (done) => {
        var test_key = 'test_key',
            test_val = 'test_val';
            
        redis_client.set(test_key, test_val, (err) => {
            if (err) return done(err);
            
            assert.equal(redis.store[test_key], test_val);
            
            done();
        });
    });
```