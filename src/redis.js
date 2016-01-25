'use strict';

function Redis() {
    this.store = [];

    this.get = function (key, callback) {

        var value = this.store[key] || null;

        callback(null, value);

        return this;
    };

    this.set = function (key, object, callback) {
        this.store[key] = object;

        callback(null);
    };

    this.del = function (key, callback) {
        this.store[key] = null;

        callback();
    };

    this.incr = function (key, callback) {

        this.store[key] ? this.store[key] ++  : this.store[key] = 1;

        if (typeof(callback) === 'function')
            callback(null, this.store[key]);

        return this;
    };

    this.watch = function (key, callback) {
        if (typeof(callback) === 'function')
            callback();
    };

    this.multi = function () {
        return this;
    };

    this.exec = function (callback) {
        callback();
    };

    this.exists = function (key, callback) {
        this.store[key] ? callback(null, 1) : callback(null, 0);
    };

    this.sadd = function (key, object, callback) {

        function _save_value(arr, value) {
            arr.push(value);
        }

        if (this.store[key]) {
            if (this.store[key] instanceof Array) {
                _save_value(this.store[key], object);

                callback(null);
            } else {
                callback(new Error());
            }
        } else {
            this.store[key] = [];

            _save_value(this.store[key], object);

            callback(null);
        }
    };

    this.smembers = function (key, callback) {
        this.store[key] instanceof Array ? callback(null, this.store[key]) : callback(new Error(), null);
    };

    this.srem = function (key, object, callback) {
        var set = this.store[key];

        if (set instanceof Array) {
            var position = set.indexOf(object);

            if (position > -1) {
                set.splice(position, 1);
            }

            callback(null);
        } else {
            callback(new Error());
        }
    };

    this.sinter = function (keys, callback) {
        var self = this;

        if (keys.length === 1) {
            if (this.store[keys[0]]) {
                callback(null, this.store[keys[0]]);
            } else {
                callback(new Error('Cant find key'), null);
            }
        } else {
            var result = [];
            this.store[keys[0]].forEach(function (id) {
                var flag = true;

                keys.forEach(function (key) {
                    if (!(self.store[key].indexOf(id) >= 0)) {
                        flag = false;
                    }
                });

                if (flag) {
                    result.push(id);
                }
            });

            callback(null, result);
        }
    };
}

module.exports = new Redis();