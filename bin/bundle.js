#!/usr/bin/env node

var program = require('commander');
var bundle = require('../index.js');

program
  .version('0.0.1')
  .description('bundle static packages')
  .option('-api, --api [api]', 'checkupdate api')
  .option('-dir, --dir [dir]', 'destination path, defaults to pwd')
  .parse(process.argv);


var api = program.api;
if (!api) {
  console.log('you must specify the checkupdate api');
  process.exit(0);
}

var app = /app\/(.+)\/checkupdate/.exec(api)[1];

bundle({
  dir: program.dir,
  app: app,
  api: api,
})
