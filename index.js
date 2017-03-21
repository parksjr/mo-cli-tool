#!/usr/bin/env node
require.all = require('require.all');
var chalk = require('chalk');
var program = require('commander');
var Datastore = require("nedb");

// globals
global.__base = __dirname;

var _scriptsDir = __dirname + '\\scripts';

var controller = {
  program: program,
  db: {
    load: function(name) {
      controller.db.name = name;
      var dbPath = controller.db.path + "\\" + name + ".db";
      controller.db[name] = new Datastore({ filename: dbPath, autoload: true });
    },
    name: "",
    path: global.__base + '\\data',
    exec: {
      insert: function(itemKey, value, callback) {
        if (callback == null) callback = controller.response;
        var document = { item: itemKey, value: value };
        var onInserted = function(err, doc) {
          if (!err) {
            callback(doc);
          }
          else {
            callback(null, err);
          }
        };
        controller.db[controller.db.name].insert(document, onInserted);
      },
      findOne: function(itemKey, callback) {
        if (callback == null) callback = controller.response;
        var onFound = function(err, doc) {
          if (!err) {
            if (doc != null) {
              callback(doc);
            }
          }
          else {
            callback(null, err);
          }
        };
        controller.db[controller.db.name].findOne({ item: itemKey }, onFound);
      },
      removeByKey: function(itemKey, callback) {
        if (callback == null) callback = controller.response;
        var onRemoved = function(err, count) {
          if (!err) {
            callback(count + " documents removed.");
          }
          else {
            callback(null, err);
          }
        };
        controller.db[controller.db.name].remove({ item: itemKey }, { multi: true }, onRemoved);
      }
    }
  },
  response: function(msg, err) {
    if (!err) {
      console.log(msg);
    }
    else {
      console.log(chalk.red(err));
    }
  }
};

//  require.all scripts in the _scriptsDir directory that follow the naming convention [tool name]-tool.js
var scripts = require.all({ dir: _scriptsDir, match: /-tool\.js/i })(controller);

program
  .command("*")
  .action(function(cmd){
    //console.log(options);
    controller.response('command not found "' + cmd + '"');
  });

program.parse(process.argv);