var fs = require('fs');
var tool = {
  init: function(controller) {
    var res = controller.response;
    var err = function(msg) {
      return res(null, msg);
    };
    controller.program
      .command('nrunner')
      .description('list npm run commands of current node project directory')
      .action(function(options) {
        if (fs.existsSync('package.json')) {
          var pjson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
          if (!pjson.scripts) {
            return err('package.json does not have a scripts section.')
          }
          res('Runnable scripts for this project: ' + pjson.name, null, 'green');
          for (var script in pjson.scripts) {
            if (script.indexOf('pre') !== 0 && script.indexOf('post') !== 0) {
              res('npm run ' + script);
            }
          }
        }
        else {
          return err('Not a valid node project directory');
        }
      });
  }
}

module.exports = tool.init;