var glob = require('glob');
var chalk = require('chalk');
var args = process.argv.slice(2);
var tool = args[0];

function callback(msg, err) {
  if (!err) {
    console.log(msg);
  }
  else {
    console.log(chalk.red(err));
  }
}

var helpCmds = [];

var scripts = glob.sync('./scripts/*.js');
scripts.forEach(function (script) {
  var module = require(script);
  module.main(args, callback);
  helpCmds = helpCmds.concat(module.help);
  //console.log(module.help);
});

var tool = args[0];
var method = args[1];
if (tool == 'help') {
  for (i=0;i<helpCmds.length;i++) {
    console.log(chalk.green(helpCmds[i]));
  }
}