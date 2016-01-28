'use strict';

var request = require('request')
  , _ = require('lodash')
  , path = require('path');

var cache = require('super-cache');

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
    cacheDuration: 1000 * 60 * 60 * 24 // 1 día
  });

  this._cache = new cache(this.config);

  return this;
};

GooglePlaces.prototype.autocomplete = function(options, cb) {
  options = _.defaults(options, {
    language: 'en',
    sensor: false
  });

  var _cachePath = this._getCachePath(options.input, options.language);

  this._process(_cachePath, options, 'autocomplete', cb);
};

GooglePlaces.prototype.details = function(options, cb) {
  options = _.defaults(options, {
    reference: options.reference,
    sensor: false,
    language: 'en'
  });

  var _cachePath = this._getCachePath(options.reference, options.language);

  this._process(_cachePath, options, 'details', cb);
};

GooglePlaces.prototype._getCachePath = function(input, lang) {
  return input + '-' + lang;
};

GooglePlaces.prototype._process = function(cachePath, query, method, cb) {
  var that = this;
  this._cache.get(cachePath, function(err, data) {
    if(err) {
      return that._doRequest(query, method, function(err, data) {
        if(err) {
          return cb(err);
        }
        var dataObject = JSON.parse(data);
        that._cache.set(cachePath, dataObject, function(err) {
          if(err) {
            return cb(err);
          }
          return cb(null, dataObject);
        });
      });
    }
    return cb(null, data.content);
  });
};

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

//Google place search
// GooglePlaces.prototype.search = function(options, cb) {
//   options = _.defaults(options, {
//     location: [42.3577990, -71.0536364],
//     radius: 10,
//     sensor: false,
//     language: 'en',
//     rankby: 'prominence',
//     types: []
//   });

//   options.location = options.location.join(',');

//   if (options.types.length > 0) {
//     options.types = options.types.join('|');
//   } else {
//     delete options.types;
//   }
//   if (options.rankby == 'distance')
//     options.radius = null;

//   this._doRequest(this._generateUrl(options, 'search'), cb);
// };
