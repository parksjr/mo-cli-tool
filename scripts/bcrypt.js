var bcrypt = require('bcrypt-nodejs');
module.exports = {
  main: function(args, callback) {
    var tool = args[0];
    var method = args[1];
    if (tool == 'bcrypt') {
      if (method) {
        if (method.match(/(?:salt|gensalt)$/i)) {
          var rounds = parseInt(args[2]);
          if(!isNaN(rounds)) {
            callback(bcrypt.genSaltSync());
          }
          else {
            callback(bcrypt.genSaltSync(rounds));
          }
        }
        else {
          callback(null, 'unrecognized command');
        }
      }
      else {
        callback(null, 'bcrypt command does not take 0 arguments');
      }
    }
  },
  help: [
    "mtool bcrypt salt",
    "mtool bcrypt salt [rounds]"
  ]
};