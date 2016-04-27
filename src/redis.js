'use strict';

function Redis() {
    this.store = [];

    this.get = function (key, callback) {

        var value = this.store[key] || null;

        callback(null, value);

        return this;
    };
    
    this.mget = function (keys, callback) {
        var self = this;
        var result = [];
        
        keys.forEach(function (key) {
            result.push(self.store[key] || null);
        });
        
        callback(null, result);
    };

    this.set = function (key, object, callback) {
        this.store[key] = object;

        callback(null);
    };

    this.del = function (key, callback) {
        this.store[key] = null;

        if (callback instanceof Function) callback(); else return this;
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
    
    this.exec_atomic = function (callback) {
        callback();
    };

    this.exists = function (key, callback) {
        this.store[key] ? callback(null, 1) : callback(null, 0);
    };

    this.sadd = function (key, object, callback) {

        var self = this;
        
        function save_value(arr, value) {
            arr.push(value);
        }

        if (this.store[key]) {
            
            if (!(this.store[key] instanceof Array)) {
                return done(new Error());
            }
            
            if (object instanceof Array) {
                object.forEach(save_value);
            } else {
                save_value(this.store[key], object);
            }

            return done(null);
            
        } else {
            
            this.store[key] = [];

            if (object instanceof Array) {
                this.store[key] = object;
            } else {
                save_value(this.store[key], object);
            }

            return done(null);
        }
        
        function done(error) {
            if (callback instanceof Function) callback(error); else return self;
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

    this.hset = function (key, field, value, callback) {

        if (!key || !field || !value) {
            return callback(new Error('Wrong arguments'));
        }

        if (!this.store[key]) {
            this.store[key] = [];
        }

        this.store[key][field] = value;

        return callback(null);
    };

    this.hmset = function (key, object, callback) {
        this.store[key] = object;
        
        callback();
    };
    
    this.hget = function (key, field, callback) {
        if (!key || !field) {
            return callback(new Error('Wrong arguments'));
        }

        if (!this.store[key]) {
            return callback(null, null);
        }

        callback(null, this.store[key][field]);
    };

    this.hgetall = function (key, callback) {
        if (!this.store[key]) {
            return callback(null, null);
        }

        var self = this;
        var result = {};

        Object.keys(this.store[key]).forEach(function (item) {
            result[item] = self.store[key][item];
        });

        callback(null, result);
    };
    
    this.keys = function (pattern, callback) {
        var exp = new RegExp('^' + pattern.replace('*', '.*') + '$');
        var result = [];
        
        Object.keys(this.store).forEach(function (key) {
            exp.test(key) ? result.push(key) : null
        });
        
        callback(null, result);
    };
}

module.exports = new Redis();