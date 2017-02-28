var tool = {
  init: function(controller) {
    var db = controller.db;
    controller.program
      .command('test')
      .option('-t, --test', 'tests the test')
      .description('testing, testing..')
      .action(function(options) {
        db.load("test");
        if (options.test) {
          db.exec.removeByKey('test');
          db.exec.insert('test', 'one two.. one two..');
        }
        else {
          controller.response('one two.. one two..');
        }
      });
  }
};
module.exports = tool.init;