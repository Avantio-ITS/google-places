'use strict';

var gulp = require('gulp');
var bump = require('gulp-bump');
var argv = require('yargs').argv;
var pjson = require('../package.json');

module.exports = function(options) {

  var logError = options.errorHandler('Version');

  var makeVersion = function(bumpObject) {
    gulp.src('./package.json')
      .pipe(bump(bumpObject))
      .pipe(gulp.dest('./'));
  };

  var versionByType = function(type, key) {
    key = key ? key : 'version';
    makeVersion({
      type: type,
      key: key
    });
  };

  var versionByName = function(version, key) {
    makeVersion({
      version: version,
      key: key
    });
  };

  var calculateVersion = function(key) {
    var version = pjson[key];
    if (!argv.version) {
      return logError('No se ha pasado ninguna versión de como parametro!!');
    }
    if (!version) {
      return logError('El atributo ' + key + ' no existe dentro del package.json!!');
    }
    if (version.indexOf('dev') < 0) {
      return logError(key + ' no tiene una versión de desarrollo versionale (no se encuentra el "dev")!!');
    }
    var ver = version.split('dev')[0] + 'dev';
    var buildVersion = argv.version;
    var newVersion = ver + '.' + buildVersion;
    return versionByName(newVersion, key);
  };

  gulp.task('bump:ci', function() {
    return calculateVersion('version');
  });

  gulp.task('bump:version', function() {
    if (!argv.version) {
      return logError('No se ha pasado ninguna versión como parametro!!');
    }
    return versionByName(argv.version);
  });

  gulp.task('bump:patch', function() {
    return versionByType('patch');
  });

  gulp.task('bump:minor', function() {
    return versionByType('minor');
  });

  gulp.task('bump:major', function() {
    return versionByType('major');
  });

};
