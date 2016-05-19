import template from 'lodash/fp/template';

const msgLeftTemplate = template(`
  <div class="msg-container">
    <div class="msg-left">
      <div class="msg-text"><%= msg %></div>
    </div>
  </div>
`);

const msgRightTemplate = template(
  `<div class="msg-container">
    <div class="msg-right">
      <div class="msg-text"><%= msg %></div>
    </div>
  </div>`
);

function renderMsgLeft($parent, message) {
  $parent
    .append(msgLeftTemplate({msg: message}))
    .scrollTop($parent[0].scrollHeight);
}

function renderMsgRight($parent, message) {
  $parent
    .append(msgRightTemplate({msg: message}))
    .scrollTop($parent[0].scrollHeight);
}

export {
  renderMsgLeft,
  renderMsgRight
}
