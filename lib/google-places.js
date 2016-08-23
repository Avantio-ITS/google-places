'use strict';

var request = require('request'),
  _ = require('lodash'),
  path = require('path'),
  Cache = require('super-cache');

/**
 * [GooglePlaces description]
 * @param {Object} config
 */
var GooglePlaces = function(config) {
  config = config || {};

  this.config = _.defaults(config, {
    format: 'json',
    host: 'maps.googleapis.com',
    protocol: 'https',
    path: '/maps/api/place/',
    cachePrefix: 'GooglePlaces-',
    cacheClient: 'disk',
    cacheFolder: __dirname + '/../tmp/cache',
    cacheDuration: 1000 * 60 * 60 * 24,
    types: 'geocode'
  });

  this._cache = new Cache(this.config);

  return this;
};

/**
 * [autocomplete description]
 * @param  {Object}   options
 * @param  {Function} cb
 * @return {}
 */
GooglePlaces.prototype.autocomplete = function(options, cb) {
  options = _.defaults(options, {
    language: 'en',
    sensor: false,
    types: this.config.type,
    location: '0,0',
    radius: '20000000'
  });

  var input = _.chain(options.input).trim().toLower();
  var _cachePath = this._getCachePath(input, options.language);

  this._process(_cachePath, options, 'autocomplete', cb);
};

/**
 * [details description]
 * @param  {Object}   options
 * @param  {Function} cb
 * @return {}
 */
GooglePlaces.prototype.details = function(options, cb) {
  options = _.defaults(options, {
    placeid: options.placeid,
    sensor: false,
    language: 'en',
    location: '0,0',
    radius: '20000000'
  });

  var _cachePath = this._getCachePath(options.placeid, options.language);

  this._process(_cachePath, options, 'details', cb);
};

/**
 * [_getCachePath description]
 * @param  {String} input
 * @param  {String} lang
 * @return {}
 */
GooglePlaces.prototype._getCachePath = function(input, lang) {
  return input + '-' + lang;
};

/**
 * [_process description]
 * @param  {String}   cachePath
 * @param  {Object}   query
 * @param  {[type]}   method
 * @param  {Function} cb
 * @return {}
 */
GooglePlaces.prototype._process = function(cachePath, query, method, cb) {
  var that = this;
  this._cache.get(cachePath, function(err, data) {
    if(!err) {
      return cb(null, data.content);
    }

    return that._doRequest(query, method, function(err, data) {
      if(err) {
        return cb(err);
      }

      var dataObject = JSON.parse(data);
      if(dataObject.status !== 'OK') {
        return cb(null, dataObject);
      }

      that._cache.set(cachePath, dataObject, function(err) {
        if(err) {
          return cb(err);
        }
        return cb(null, dataObject);
      });
    });
  });
};

/**
 * [_doRequest description]
 * @param  {Object}   query
 * @param  {[type]}   method
 * @param  {Function} cb
 * @return {}
 */
GooglePlaces.prototype._doRequest = function(query, method, cb) {
  var _path = path.join(this.config.path, method, this.config.format);
  query.key = this.config.key;

  request.get({
    url: this.config.protocol + '://' + this.config.host + '/' + _path,
    qs: query
  }, function(err, res, data) {
    if(err) {
      return cb(err);
    }
    cb(null, data);
  });
};

module.exports = GooglePlaces;
