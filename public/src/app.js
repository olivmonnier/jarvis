'use strict';

import template from 'lodash/fp/template';
import $ from 'jquery';

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

$(document).ready(() => {
  $(document).on('keypress', '.editor input', (e) => {
    if (e.keyCode === 13 )
      e.preventDefault();
    let value = $('.editor input').val();
    let $discuss = $('.discuss');

    if (e.keyCode === 13 && value) {
      $discuss
        .append(msgRightTemplate({msg: value}))
        .scrollTop($discuss[0].scrollHeight);
      $('.editor input').val('');

      $.post('/reply', {'username': 'user', 'message': value})
        .done(response => {
          $discuss
            .append(msgLeftTemplate({msg: response.reply}))
            .scrollTop($discuss[0].scrollHeight);

          if (response.ext)
            $('.extension').html(response.ext);
        });
    }
  });
});
