var fs = require('fs');
var postgrator =  {
  tool: require('postgrator'),
  init: function(configPath, migrationsDir, jsonConfig, callback) {
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir);
      callback(`migrations directory created at ${migrationsDir}`);
    }
    else callback(null, `${migrationsDir} already exists...`, 'yellow');

    if (!fs.existsSync(configPath)) {
      fs.writeFile(configPath, jsonConfig, function(err) {
        if (err) {
          return callback(null, err);
        }
        callback(`db config file created at ${configPath}`);
      });
    }
    else callback(null, `${configPath} already exists...`, 'yellow');
  },
  trySetConfig: function(path, callback) {
    if (!fs.existsSync(path)) {
      callback(null, `The file '${path}' does not exist. exiting...`);
      return false;
    }
    try {
      postgrator.tool.setConfig(path);
    }
    catch(err){
      res('There was an error trying to connect to the database:');
      res(null, err.message);
      return false;
    }
    return true;
  },
  validateMigrationDescription: function(description, callback) {
    var errMsg = 'migration description cannot contain periods or spaces';
    if (description.indexOf('.') > -1 || description.indexOf(' ') > -1) {
      callback(null, errMsg);
      return false;
    }
    return true;
  },
  getLatestVersion: function(migrationsDir, callback) {
    var output = 0;
    if (!fs.existsSync(migrationsDir)) {
      callback(null, 'migration directory not initialized. see help for more information.');
      return false;
    }
    var files = fs.readdirSync(migrationsDir);
    files.forEach(function(file) {
      var arr = file.split('.');
      var version = arr.length > 0 ? arr[0] : '0';
      output = Math.max(Number(arr[0]), output);
    });
    return output;
  },
  padVersion: function(n, width, z) {
    width = width || 4;
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  },
  getTemplate: function(template, action, callback) {
    action = action == 'undo' ? action : 'do';
    var templateName = "pg."+ action + "." + template + ".sql";
    var templateType = "pgtemplates";
    //var templatePath = global.__base + "\\templates\\pgtemplates\\pg." + action + "." + template + ".sql";
    controller.getTemplateFile(templateType, templateName, callback);
  },
  createMigrationFile: function(fileName, data, callback) {
    controller.createTemplateFile(fileName, data, res, "Migration file");
  }
};

var defaultConfig = "postgrator.json";
var defaultMigrationDirectory = "migrations";
var tool = {
  init: function(controller) {
    var res = controller.response;
    controller.program
      .command('grator')
      .description('postgrator migrations helper')
      .option('-i, --init_pg', 'initialize a new postgrator working directory')
      .option('-c, --config [filename.json]', `specify config file name (default: ${defaultConfig})`)
      .option('-m, --migration_directory', `specify migration directory name (default: ${defaultMigrationDirectory})`)
      .option('-n, --new_migration [description]', 'creates a new set of sql migration files in the migrations directory')
      .option('-v, --version_migration', 'shows current migration version')
      .option('-t, --migration_template [option]', 'used with --new_migration, options: table, procedure, crud')
      .action(function(options) {
        defaultConfig = controller.getOptionOrDefault(options.config, defaultConfig);
        if (defaultConfig.substr(-5) !== '.json') {
          defaultConfig += ".json";
        }
        defaultMigrationDirectory = controller.getOptionOrDefault(options.migration_directory, defaultMigrationDirectory);

        var migrationDir = process.cwd() + "\\" + defaultMigrationDirectory;
        var configPath = process.cwd() + "\\" + defaultConfig;

        if (options.init_pg) {
          res(`initializing postgrator working directory...`);

          postgrator.init(configPath, migrationDir, 'Hello World!', res);

          return;
        }

        if ("new_migration" in options) {
          var description = controller.getOptionOrDefault(options.new_migration, 'new-migration');
          res(description);
          if (postgrator.validateMigrationDescription(description, res)) {
            //get next version
            var curVersion = postgrator.getLatestVersion(migrationDir, res);
            if (!isNaN(curVersion)) {
              curVersion++;
            }
            else return false;
            //create new file
            var template = controller.getOptionOrDefault(options.migration_template, 'empty');
            var dataCallback = function(data, err, action) {
              if (err) {
                return res(null, err);
              }
              var fileName = migrationDir + '\\' + postgrator.padVersion(curVersion) + '.' + action + '.' + description + '.sql';
              postgrator.createMigrationFile(fileName, data, res);
            };
            var doData = postgrator.getTemplate(template, 'do', dataCallback);
            var undoData = postgrator.getTemplate(template, 'undo', dataCallback);
          }
          return;
        }

        if ("version_migration" in options) {
          var curVersion = postgrator.getLatestVersion(migrationDir, res);
          res(`current migration version: ${curVersion}`);
          return;
        }

        // lets not go this far yet
        return;
          
        if (postgrator.trySetConfig(configPath, res)) {
          res('config set, ready to migrate');
        }
      });
  }
};
module.exports = tool.init;