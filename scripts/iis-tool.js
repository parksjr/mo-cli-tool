'use strict';
const exec = require('child_process').exec;
const appcmdLoc = '%systemroot%\\system32\\inetsrv\\appcmd';
var appcmd = {
  listSites: `${appcmdLoc} list sites`,
  listApps: function(siteName) {
    return `${appcmdLoc} list apps /site.name:"${siteName}`;
  },
  listVdirs: function(siteName) {
    return `${appcmdLoc} list vdirs /app.name:"${siteName}"`;
  },
  listAppPools: `${appcmdLoc} list apppools`,
  listAppPool: function(appPoolName) {
    return `${appcmdLoc} list apppool "${appPoolName}" /text:*`;
  },
  recycleAppPool: function(appPoolName) {
    return `${appcmdLoc} recycle apppool /apppool.name:"${appPoolName}"`;
  },
  run: function(cmd, callback) {
    exec(cmd, (error, stdout, stderr) => {
      if (error != null) {
        callback(null, (stdout != null ? stdout : error));
      }
      else {
        callback(stdout);
        var serr = `${stderr}`;
        if (serr != '') {
          callback(null, `${stderr}`);
        }
      }
    });
  }
};
var tool = {
  init: function(controller) {
    var db = controller.db;
    controller.program
      .command('iis')
      .option('-l, --list_sites [optional name]', 'List of available IIS site(s)')
      .option('-a, --app_pools [optional name]', 'List of IIS application pools')
      .option('-r, --recycle_app_pool [required name]', 'Recycle a given application pool by name')
      .description('Run some IIS commands in one place')
      .action(function(options) {
        var res = controller.response;
        // list site(s)
        if (typeof options.list_sites === 'string') {
          appcmd.run(appcmd.listApps(options.list_sites), res);
        }
        else if (options.list_sites) {
          appcmd.run(appcmd.listSites, res);
        }
        // list app pool(s)
        if (typeof options.app_pools === 'string') {
          appcmd.run(appcmd.listAppPool(options.app_pools), res);
        }
        else if (options.app_pools) {
          appcmd.run(appcmd.listAppPools, res);
        }
        //recycle app pool
        if (typeof options.recycle_app_pool === 'string') {
          appcmd.run(appcmd.recycleAppPool(options.recycle_app_pool), res);
        }
        else if (options.recycle_app_pool) {
          res(null, 'APPCMD ERROR: Please supply an application pool name');
        }
      });
  }
};
module.exports = tool.init;