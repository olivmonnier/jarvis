import template from 'lodash/fp/template';

function renderShortcut (name, request) {
  const words = name.split(' ');
  const firstChars = words.map(word => word.charAt(0));
  const sigle = firstChars.join('');
  const shortcutTemplate = template(
    '<div class="item" data-request="<%= data.request %>" data-toggle="tooltip" data-placement="bottom" title="<%= data.name %>">' +
      '<div class="item-name">' +
        '<%= data.sigle %>' +
      '</div>' +
    '</div>'
  );

  return shortcutTemplate({ data: {
    name,
    request,
    sigle
  }});
}

function runRequest ($el) {

}

export {
  renderShortcut,
  runRequest
}
