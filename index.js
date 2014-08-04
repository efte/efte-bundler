var async = require('async');
var request = require('request');
var http_get = require('http-get');
var mkdirp = require('mkdirp');
var path = require('path');
var fe = require('fs-extra');
var cp = require('child_process');

function getHome() {
  var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  return path.join(home, '.efte-bundler');
}

var home = getHome()
var packDir = path.join(home, 'packages');
fe.removeSync(home);

module.exports = function(options) {
  var dir = options.dir || process.cwd();
  var app = options.app;
  var api = options.api;

  async.waterfall([

    function getConfig(done) {
      request({
        url: api,
        method: 'POST',
        body: JSON.stringify({
          appName: app,
          packages: {}
        }),
        headers: {
          'Content-type': 'application/json'
        }
      }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          return done(null, JSON.parse(body))
        } else {
          return done(err);
        }
      })
    },
    function saveConfig(config, done) {
      fe.outputJson(path.join(home, 'config'), config, function(err) {
        done(err, config);
      });
    },
    function downloadZip(config, done) {
      async.each(Object.keys(config.packages), function(packName, done) {
        var pack = config.packages[packName];
        downloadPackage(pack, done);
      }, function(err) {
        done(err)
      })
    },
    function bundle(done) {
      var jobPath = path.join(__dirname, './bin/bundle.sh');
      var command = 'sh ' + jobPath + ' ' + home + ' ' + dir;
      console.log('bundle to %s', dir);
      cp.exec(command,
        function(err, stdout, stderr) {
          done(err);
        });
    }
  ], function(err) {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      console.log('done');
    }
  })
}

function downloadPackage(pack, cb) {
  var zipPath = pack.zipPath;
  var localPath = path.join(packDir, pack.name, pack.version);
  mkdirp.sync(localPath);
  var jobPath = path.join(__dirname, './bin/download.sh');
  var command = 'sh ' + jobPath + ' ' + zipPath + ' ' + localPath;
  console.log('download package:%s@%s...', pack.name, pack.version);
  cp.exec(command,
    function(err, stdout, stderr) {
      cb(err);
    });
}