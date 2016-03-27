module.exports = function(rs) {
  rs.setSubroutine('hellojs', function(rs, args) {
    return new rs.Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(JSON.stringify({
          msg: '<b>Hello World</b>',
          ext: ''
        }, null, 2));
      }, 2000)
    });
  });
}
