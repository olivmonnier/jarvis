module.exports = function(rs) {
  rs.setSubroutine('hellojs', function(rs, args) {
    return new rs.Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve('Hello World');
      }, 2000)
    })
  });
}
