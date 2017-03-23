'use strict'
var browserstack = require('browserstack-local');
var webdriver = require('selenium-webdriver');
var fs = require('fs');

var defaultConfig = 'browserstack.json'
var tool = {
  init: function(controller) {
    var db = controller.db;
    controller.program
      .command('bs')
      .option('-c, --capabilities_file [filename]', 'optional: specifies the capabilities filename. default: browserstack.json')
      .option('-f, --first_test', 'optional: run the first test')
      .option('-l, --local_instance <access-key>', 'optional: start a local instance of browserstack')
      .option('-r, --running [pid]', 'check if browserstack instance is running')
      .option('-s, --stop [pid]', 'stop local instance with pid')
      .description('A cli tool for browserstack automation')
      .action(function(options) {
        var res = controller.response;

        if (typeof options.local_instance === 'string') {
          var bs_local = new browserstack.Local();
          var bs_local_args = { 'key': options.local_instance, 'local-identifier': 'Test123', 'forceLocal': 'true' };
          bs_local.start(bs_local_args, function() {
            res(`Started BrowserStackLocal pid: ${bs_local.pid} local-identifier: ${bs_local.localIdentifierFlag}`);
          });
          return;
        }
        if (typeof options.running === 'string') {
          var bs_local = new browserstack.Local();
          bs_local.pid = options.running;
          if (bs_local.isRunning()) {
            res('Instance is running..');
          }
          else {
            res('Instance is not running..');
          }
          return;
        }
        if (typeof options.stop === 'string') {
          var bs_local = new browserstack.Local();
          bs_local.pid = options.stop;
          bs_local.getBinaryPath(function(binaryPath) {
            //console.log(binaryPath);
            bs_local.binaryPath = binaryPath;
            bs_local.stop(function(err) {
              if (err) res(err);  
              res('BrowserStack instance stopped.');
            });
          });
          
          
          return;
        }

        var config = process.cwd() + '\\' + (typeof options.capabilities_file === 'string' ? options.capabilities_file : defaultConfig);
        if (!config.endsWith('.json')) {
          config += '.json'
        }
        if (!fs.existsSync(config)) {
          res(null, `Capabilities file '${config}' does not exist.`);
          return;
        }
        var capabilities = JSON.parse(fs.readFileSync(config, 'utf8'));
        if (options.first_test) {
          var driver = new webdriver.Builder().
            usingServer('http://hub-cloud.browserstack.com/wd/hub').
            withCapabilities(capabilities).
            build();

          driver.get('http://www.onlynaturalpet.com');
          // driver.findElement(webdriver.By.name('q')).sendKeys('BrowserStack');
          // driver.findElement(webdriver.By.name('btnG')).click();

          driver.getTitle().then(function(title) {
            res(title);
          });

          driver.quit();
        }
      });
  }
};
module.exports = tool.init;