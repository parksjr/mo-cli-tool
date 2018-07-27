var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var Zip = require('node-7z');

var tool = {
  init: function(controller) {
    var res = controller.response;
    var err = function(msg) {
      return res(null, msg);
    };
    controller.program
      .command('subhd')
      .description('retreives chinese subtitles from subhd.com for specific show or movie')
      .option('-t, --title [required title]', 'Movie or TV Show title')
      .option('-s --season [optional season #]', 'Provide season number for tv show')
      .option('-e --episode [optional episode #]', 'Provide episode number for tv show')
      .option('-y, --year [optional year]', 'Provide year of movie or show for more precise results')
      .option('-l --list', 'Only list results, don\'t download')
      .option('-i --id [optional id]', 'ID, if provided, all previous properties (t, s, e, y, l) are ignored, and the subtitle is fetched by id')
      .option('-d, --directory [optional directory]', 'directory to save the subtitle file, otherwise will use cwd')
      .action(function(options) {
        var workingDir = process.cwd();
        var subId = '';
        if (typeof options.title !== 'string' && typeof options.id !== 'string') {
          return res(null, 'Please provide a title to search (e.g. Deadpool)')
        }
        if (typeof options.directory === 'string') {
          workingDir = options.directory;
        }

        //  download function
        function download(subId, callback) {
          var options = {
            method: 'POST',
            url: 'http://subhd.com/ajax/down_ajax',
            headers: {
              'Cache-Control': 'no-cache'
            },
            formData: {
              sub_id: subId
            }
          }
          request(options, callback);
        }

        //todo:  rename file to match video file
        //todo: add chinese language code (zh_CN) to file name
        function unzipFile(file) {
          var myTask = new Zip();
          var destination = file.substr(0, file.lastIndexOf('\\'));
          myTask.extract(file, destination, {})
            .progress(function(files) {
              console.log('Some files are extracted: %s', files)
            })
            .then(function() {
              res('Extracting done!', null, 'green');
            })
            .catch(function(err) {
              res(null, err, 'red');
            });
        }
        function downloadCallback(error, response, body) {
          if (error) {
            return res(null, error);
          }
          var o = JSON.parse(body);
          if (o.success) {
            var fileNameAndPath = workingDir + '\\' + options.title + '-' + o.url.substr(o.url.lastIndexOf('/')+1);
            var fileExt = o.url.substr(o.url.lastIndexOf('.')+1);
            return request.get(o.url)
              .on('response', function(resp) {
                //var filename = regexp.exec(resp.headers['content-disposition'])[1];
                var fws = fs.createWriteStream(fileNameAndPath);
                resp.pipe(fws);
                resp.on('end', function() {
                  res(o.url + ' =====> ' + fileNameAndPath, null, 'green');
                  return unzipFile(fileNameAndPath);
                });
              });
          }
        }

        if (typeof options.id !== 'string') {
          var url = 'http://subhd.com/search0/' + encodeURIComponent(options.title);
          request(url, function(error, response, html) {
            if (error) {
              return res(null, error);
            }
            var $ = cheerio.load(html);
            // count
            var count = $('.container.list > h3 > small > b:first-child').text();
            res('total count: ' + count);
            // list
            if (options.list) {
              var list = $('.d_title > a');
              if (list.length === 0) {
                return res(null, 'No subtitles found');
              }
              return list.each(function(i, element) {
                var a = $(this);
                var href = a.attr('href');
                var title = a.text();
                var sid = href.substr(href.lastIndexOf('/')+1);
                res(sid + ': ' + title, null, 'green');
              });
            }
            else {
              var firstOne = $($('.d_title > a')[0]);
              var href = firstOne.attr('href');
              if (typeof href === 'undefined') {
                return res(null, 'No subtitles found');
              }
              var sId = href.substr(href.lastIndexOf('/')+1);
              return download(sId, downloadCallback);
            }
          });
        }
        else {
          subId = options.id;
          return download(subId, downloadCallback);
        }
      });
  }
}

module.exports = tool.init;