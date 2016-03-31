var Youtube = require('youtube-node');
var template = require('lodash/fp/template');

var youtube = new Youtube();
youtube.setKey('AIzaSyA8UFoMWx8wWQxkCgri95mrXqwVILcFXqk');

var ytListTemplate = template('<ul class="list-unstyled">' +
  '<% data.videos.forEach(function(video) { %>' +
    '<li>' +
      '<h4><%= video.snippet.title %> - <small><%= video.snippet.channelTitle %></small></h4>' +
      '<p><small><%= video.snippet.description %></small></p>' +
      '<iframe id="ytplayer" type="text/html" width="380" height="200" src="http://www.youtube.com/embed/<%= video.id.videoId %>" frameborder="0"/>' +
    '</li>' +
  '<% }) %>' +
'</ul>');

module.exports = function(rs) {
  rs.setSubroutine('youtube', function(rs, args) {
    return new rs.Promise(function(resolve, reject) {
      youtube.search(args[0], 10, function(error, result) {
        if (error) return console.log(error);

        resolve(JSON.stringify({
          msg: 'I found these videos',
          ext: ytListTemplate({data: {videos: result.items}})
        }, null, 2));
      });
    });
  });
}
