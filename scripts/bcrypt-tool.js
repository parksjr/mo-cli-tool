var bcrypt = require('bcrypt-nodejs');
var tool = {
  init: function(controller) {
    var db = controller.db;
    controller.program
      .command('bcrypt')
      .description('tool for bcrypt commands')
      .option("-s, --salt", "Generates a random salt")
      .option("-l, --last_salt", "Prints last generated salt")
      .option("-p, --password [string]", "Generates a random hash")
      .option("-r, --rounds [num]", "How many rounds to process the data")
      .option("-d, --delete", "Deletes stored salt data")
      .action(function(options){
        // initialize datastore for bcrypt
        db.load('bcrypt');
        var res = controller.response;
        //  process options and take action
        var rounds = options.rounds || 10;
        var callbackOverride = function(doc, err) {
          if (!err) {
              if (doc != null) {
                res(doc.value);
              }
            }
            else {
              res(null, err);
            }
        };
        if (options.last_salt) {
          db.exec.findOne('salt', callbackOverride);
        }
        if (options.salt) {
          db.exec.removeByKey('salt', function(msg, err) {});
          db.exec.insert('salt', bcrypt.genSaltSync(rounds), callbackOverride);
        }
        if (options.password) {
          var saltCallback = function(saltDoc, err) {
            if (err) {
              res(null, err);
            }
            else {
              var data = options.password;
              if (saltDoc != null && data != "" && typeof data === 'string') {
                var hash = bcrypt.hashSync(data, saltDoc.value);
                res("secret: " + saltDoc.value);
                res("password: " + data);
                res("hash: " + hash);
              }
              else {
                if (saltDoc.value == "") {
                  res(null, "No salt generated.");
                }
                else {
                  res(null, "No password provided.");
                }
              }
            }
          };
          db.exec.findOne('salt', saltCallback);
        }
        if (options.delete) {
          db.exec.removeByKey('salt');
        }
      });
  }
};
module.exports = tool.init;