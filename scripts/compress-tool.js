var zlib = require('zlib');
var fs = require('fs');
var tool = {
  init: function(controller) {
    var res = controller.response;
    controller.program
      .command('compress')
      .description('inflate or deflate data using the zlib library')
      .option('-s, --string [input]', 'string data to compress')
      .option('-f, --file [file]', 'file contents to compress')
      .option('-d, --deflate', 'deflate flag, deflates the input string')
      .option('-i, --inflate', 'inflate flag, inflates the input string')
      .option('-g, --gzip', 'uses gzip instead of deflate')
      .option('-r --raw', 'does not insert header')
      .action(function(options) {
        var defaultEncoding = controller.getOptionOrDefault(options.encoding, "base64");
        try
        {
          // validation
          if (typeof options.string !== 'string' && typeof options.file !== 'string') {
            return res(null, 'Must provide either --file or --string arguments for data to compress.');
          }
          if (typeof options.string === 'string' && typeof options.file === 'string') {
            return res(null, 'Cannot process --file and --string, choose one or the other.');
          }
          if (!options.deflate && !options.inflate) {
            return res(null, 'Must provide either --inflate or --deflate flag. Refer to the help doc to learn more.');
          }
          if (options.deflate && options.inflate) {
            return res(null, 'Cannot --inflate and --deflate at the same time. Choose one or the other.');
          }
          // process data
          function deflate(data) {
            if (options.gzip) {
              return zlib.gzipSync(data).toString('base64');
            }
            else {
              if (options.raw) {
                return zlib.deflateRawSync(data).toString('base64');
              }
              else return zlib.deflateSync(data).toString('base64');
            }
          }
          function inflate(data) {
            if (options.raw) {
              if (options.gzip) {
                return zlib.gunzipSync(new Buffer(data, 'base64')).toString();
              }
              else return zlib.inflateRawSync(new Buffer(data, 'base64')).toString();
            }
            //  unzip auto detects which method based on header
            else return zlib.unzipSync(new Buffer(data, 'base64')).toString();
          }
          if (typeof options.string === 'string') {
            if (options.deflate) {
              return res(deflate(options.string));
            }
            if (options.inflate) {
              return res(inflate(options.string));
            }
          }
          if (typeof options.file === 'string') {
            if (fs.existsSync(options.file)) {
              return fs.readFile(options.file, 'utf8', function(err, data) {
                if (err) throw err;
                if (options.deflate) {
                  return res(deflate(data));
                }
                if (option.inflate) {
                  return res(inflate(data));
                }
              });
            }
            else {
              return res(null, 'File does not exist: ' + options.file);
            }
          }
          return res(null, 'error: why did we reach this point?');
        }
        catch (err) {
          res(null, err.message);
        }
      });
  }
};
module.exports = tool.init;
