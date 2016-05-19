var Youtube = require('youtube-node');
var template = require('lodash/fp/template');

var yt = new Youtube();
yt.setKey('AIzaSyA8UFoMWx8wWQxkCgri95mrXqwVILcFXqk');

var ytListTemplate = template(
  '<div class="panel panel-default">' +
    '<div class="panel-body">' +
      '<% data.videos.forEach(function(video) { %>' +
        '<div class="media">' +
          '<div class="media-left media-middle">' +
            '<iframe id="ytplayer" type="text/html" width="380" height="200" src="http://www.youtube.com/embed/<%= video.id.videoId %>" frameborder="0"/>' +
          '</div>' +
          '<div class="media-body">' +
            '<h4 class="media-heading"><%= video.snippet.title %> - <small><%= video.snippet.channelTitle %></small></h4>' +
            '<p><small><%= video.snippet.description %></small></p>' +
          '</div>' +
        '</div>' +
      '<% }) %>' +
    '</div>' +
  '</div>'
);


module.exports = function(rs) {
  rs.setSubroutine('youtube', function(rs, args) {
    return new rs.Promise(function(resolve, reject) {
      yt.search(args[0], 10, function(error, result) {
        if (error) return console.log(error);

        resolve(JSON.stringify({
          msg: 'I found these videos',
          ext: ytListTemplate({data: {videos: result.items}})
        }, null, 2));
      });
    });
  });
}
