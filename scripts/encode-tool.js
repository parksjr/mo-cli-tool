var tool = {
  init: function(controller) {
    var res = controller.response;
    controller.program
      .command('encode')
      .description('simple string encoding')
      .option('-s, --string [input]', 'string to encode')
      .option('-e, --encoding [encoding]', 'optional encoding parameter, default is base64')
      .option('-d, --decoding [decoding]', 'optional decoding parameter')
      .action(function(options) {
        var defaultEncoding = controller.getOptionOrDefault(options.encoding, "base64");
        try
        {
          if (typeof options.string === 'string') {
            if (typeof options.decoding == 'string') {
              //  decode the string
              return res(new Buffer(options.string, options.decoding).toString('ascii'));
            }
            //  encode the string
            return res(new Buffer(options.string).toString(defaultEncoding));
          }
          else {
            return res(null, 'string parameter (-s) must be provided.');
          }
        }
        catch (err) {
          res(null, err.message);
        }
      });
  }
};
module.exports = tool.init;